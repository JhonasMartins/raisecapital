import { NextResponse } from 'next/server'
import { asaas } from '@/lib/asaas'
import { getCurrentUser } from '@/lib/auth'
import { query } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      ofertaId,
      valor,
      billingType, // 'PIX' | 'BOLETO' | 'CREDIT_CARD' (default PIX)
      description,
      dueDate, // YYYY-MM-DD
      externalReference,
      // Dados opcionais para cartão
      creditCardToken,
      creditCard,
      creditCardHolderInfo,
    } = body ?? {}

    if (!valor || typeof valor !== 'number' || valor <= 0) {
      return NextResponse.json({ error: 'Valor inválido' }, { status: 400 })
    }

    const apiKey = process.env.ASAAS_API_KEY
    const billing = (billingType || 'PIX') as 'PIX' | 'BOLETO' | 'CREDIT_CARD'

    // Fallback mock quando não há configuração do Asaas
    if (!apiKey) {
      if (billing === 'PIX') {
        const svg = encodeURIComponent(
          `<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'>
            <rect width='256' height='256' fill='white'/>
            <rect x='16' y='16' width='224' height='224' fill='black'/>
            <rect x='32' y='32' width='64' height='64' fill='white'/>
            <rect x='160' y='32' width='64' height='64' fill='white'/>
            <rect x='32' y='160' width='64' height='64' fill='white'/>
            <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='18' fill='white'>PIX Demo</text>
          </svg>`
        )
        return NextResponse.json({
          encodedImage: `data:image/svg+xml;utf8,${svg}`,
          payload: `PIX|DEMO|oferta:${ofertaId ?? 'n/a'}|valor:${valor}`,
          mocked: true,
          billingType: 'PIX',
        })
      }

      if (billing === 'BOLETO') {
        // Retorno mínimo para desenvolvimento sem ASAAS
        return NextResponse.json({
          id: `pay_mock_boleto_${Date.now()}`,
          billingType: 'BOLETO',
          bankSlipUrl: 'about:blank#boleto-demo',
          identificationField: '00000.00000 00000.000000 00000.000000 0 00000000000000',
          dueDate: dueDate || null,
          mocked: true,
        })
      }

      // CREDIT_CARD (mock)
      return NextResponse.json({
        id: `pay_mock_cc_${Date.now()}`,
        billingType: 'CREDIT_CARD',
        status: 'CONFIRMED',
        authorized: true,
        last4: '4242',
        mocked: true,
      })
    }

    // Obter usuário autenticado
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    // Carregar dados do usuário no banco (cpf/cnpj e asaas_customer_id)
    const userRowRes = await query(
      `SELECT id, email, name, tipo_pessoa, cpf, cnpj, asaas_customer_id FROM users WHERE id = $1`,
      [currentUser.id]
    )
    if (userRowRes.rows.length === 0) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    const userRow: any = userRowRes.rows[0]
    let customerId: string | null = userRow.asaas_customer_id || null

    // Se não há customer vinculado, tentar buscar/criar agora
    if (!customerId) {
      const tipoPessoa = userRow.tipo_pessoa === 'pj' ? 'pj' : 'pf'
      const cpfCnpj = (tipoPessoa === 'pj' ? userRow.cnpj : userRow.cpf) as string | null
      const normalizedDoc = cpfCnpj ? String(cpfCnpj).replace(/\D/g, '') : null

      if (!normalizedDoc) {
        return NextResponse.json({ error: 'Documento (CPF/CNPJ) ausente no cadastro do usuário' }, { status: 400 })
      }

      // Tentar localizar existente
      try {
        const existing = await asaas.getCustomerByCpfCnpj(normalizedDoc)
        if (existing?.data && existing.data.length > 0) {
          customerId = existing.data[0]?.id || null
        }
      } catch (e) {
        // segue para tentativa de criação
      }

      // Criar se ainda não encontrado
      if (!customerId) {
        const personType = tipoPessoa === 'pj' ? 'JURIDICA' : 'FISICA'
        const displayName = (tipoPessoa === 'pj' ? (userRow.razao_social || userRow.name) : userRow.name) as string
        const created = await asaas.createCustomer({
          name: displayName,
          email: userRow.email,
          cpfCnpj: normalizedDoc,
          personType,
          notificationEnabled: true,
        })
        customerId = created?.id || null
      }

      if (!customerId) {
        return NextResponse.json({ error: 'Falha ao vincular cliente no Asaas' }, { status: 502 })
      }

      // Persistir no banco
      await query('UPDATE users SET asaas_customer_id = $1 WHERE id = $2', [customerId, currentUser.id])
    }

    // Cria pagamento real via Asaas
    const today = new Date()
    const defaultDue = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000) // +3 dias

    const basePayload: any = {
      customer: customerId,
      value: valor,
      billingType: billing,
      description: description || `Aporte ${ofertaId ?? 'oferta'}`,
      dueDate: (dueDate || defaultDue.toISOString().slice(0, 10)),
      externalReference: externalReference || ofertaId || undefined,
    }

    if (billing === 'CREDIT_CARD') {
      if (creditCardToken) {
        basePayload.creditCardToken = creditCardToken
      } else if (creditCard && creditCardHolderInfo) {
        basePayload.creditCard = creditCard
        basePayload.creditCardHolderInfo = creditCardHolderInfo
      } else {
        return NextResponse.json({ error: 'Dados de cartão ausentes: informe creditCardToken ou (creditCard + creditCardHolderInfo)' }, { status: 400 })
      }
    }

    const payment = await asaas.createPayment(basePayload)

    if (billing === 'PIX') {
      const qr = await asaas.getPixQrCode(payment.id)
      return NextResponse.json({
        encodedImage: qr?.encodedImage ?? null,
        payload: qr?.payload ?? null,
        id: payment?.id ?? null,
        billingType: 'PIX',
      })
    }

    if (billing === 'BOLETO') {
      return NextResponse.json({
        id: payment?.id ?? null,
        billingType: 'BOLETO',
        bankSlipUrl: payment?.bankSlipUrl ?? payment?.invoiceUrl ?? null,
        identificationField: payment?.identificationField ?? null,
        payment,
      })
    }

    // CREDIT_CARD
    return NextResponse.json({
      id: payment?.id ?? null,
      billingType: 'CREDIT_CARD',
      status: payment?.status ?? null,
      authorized: payment?.authorized ?? (payment?.status === 'CONFIRMED' || payment?.status === 'RECEIVED'),
      payment,
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Erro ao criar pagamento' }, { status: 500 })
  }
}