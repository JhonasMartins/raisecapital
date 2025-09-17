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
      billingType = 'UNDEFINED', // Permite múltiplas formas de pagamento
      description,
      externalReference,
      endDate, // Data de encerramento do link
      dueDateLimitDays = 3, // Dias para pagamento após geração do boleto
      maxInstallmentCount = 1, // Máximo de parcelas
    } = body ?? {}

    if (!ofertaId) {
      return NextResponse.json({ error: 'ID da oferta é obrigatório' }, { status: 400 })
    }

    if (!valor || typeof valor !== 'number' || valor <= 0) {
      return NextResponse.json({ error: 'Valor inválido' }, { status: 400 })
    }

    const apiKey = process.env.ASAAS_API_KEY

    // Verificar se a API key está configurada
    if (!apiKey) {
      return NextResponse.json({ error: 'Configuração do Asaas não encontrada' }, { status: 500 })
    }

    // Obter usuário autenticado
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    // Verificar se a oferta existe
    const ofertaRes = await query(
      `SELECT id, titulo, valor_minimo FROM ofertas WHERE id = $1 AND status = 'ativa'`,
      [ofertaId]
    )
    if (ofertaRes.rows.length === 0) {
      return NextResponse.json({ error: 'Oferta não encontrada ou inativa' }, { status: 404 })
    }

    const oferta = ofertaRes.rows[0] as any

    // Verificar valor mínimo
    if (valor < oferta.valor_minimo) {
      return NextResponse.json({ 
        error: `Valor mínimo para esta oferta é R$ ${oferta.valor_minimo}` 
      }, { status: 400 })
    }

    // Calcular data de encerramento (padrão: 7 dias)
    const defaultEndDate = new Date()
    defaultEndDate.setDate(defaultEndDate.getDate() + 7)

    // Criar payload para o link de pagamento
    const paymentLinkPayload = {
      name: description || `Investimento - ${oferta.titulo}`,
      description: `Investimento de R$ ${valor.toFixed(2)} na oferta: ${oferta.titulo}`,
      value: valor,
      billingType: billingType as 'UNDEFINED' | 'BOLETO' | 'CREDIT_CARD' | 'PIX',
      chargeType: 'DETACHED', // Cobrança avulsa
      endDate: endDate || defaultEndDate.toISOString().slice(0, 10),
      externalReference: externalReference || `oferta_${ofertaId}_user_${currentUser.id}`,
      dueDateLimitDays,
      maxInstallmentCount,
      notificationEnabled: true,
    }

    // Criar link de pagamento via Asaas
    const paymentLink = await asaas.createPaymentLink(paymentLinkPayload)

    if (!paymentLink?.id) {
      return NextResponse.json({ error: 'Falha ao criar link de pagamento' }, { status: 502 })
    }

    // Salvar o investimento no banco com status pendente_pagamento
    const investmentRes = await query(
      `INSERT INTO investimentos (
        user_id, 
        oferta_id, 
        valor_investido, 
        status, 
        asaas_payment_link_id, 
        asaas_payment_link_url,
        asaas_payment_status,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) 
      RETURNING id`,
      [
        currentUser.id,
        ofertaId,
        valor,
        'pendente_pagamento',
        paymentLink.id,
        paymentLink.url,
        'PENDING'
      ]
    )

    const investmentId = (investmentRes.rows[0] as any)?.id

    return NextResponse.json({
      success: true,
      investmentId,
      paymentLink: {
        id: paymentLink.id,
        url: paymentLink.url,
        name: paymentLink.name,
        value: valor,
        billingType,
        endDate: paymentLink.endDate,
      }
    })

  } catch (error) {
    console.error('[create-payment-link] Erro:', error)
    const message = error instanceof Error ? error.message : 'Erro interno do servidor'
    // Expor a mensagem para facilitar diagnóstico em ambiente de dev
    return NextResponse.json({ 
      error: message 
    }, { status: 500 })
  }
}