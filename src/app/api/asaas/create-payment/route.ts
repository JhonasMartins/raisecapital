import { NextResponse } from "next/server"
import { asaas } from "@/lib/asaas"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { ofertaId, valor } = body ?? {}

    if (!valor || typeof valor !== "number" || valor <= 0) {
      return NextResponse.json({ error: "Valor inválido" }, { status: 400 })
    }

    const apiKey = process.env.ASAAS_API_KEY
    const customerId = process.env.ASAAS_CUSTOMER_ID

    // Fallback mock quando não há configuração do Asaas
    if (!apiKey || !customerId) {
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
        payload: `PIX|DEMO|oferta:${ofertaId ?? "n/a"}|valor:${valor}`,
        mocked: true,
      })
    }

    // Cria pagamento PIX real via Asaas
    const today = new Date()
    const dueDate = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000) // +3 dias
    const payment = await asaas.createPayment({
      customer: customerId,
      value: valor,
      billingType: "PIX",
      description: `Aporte ${ofertaId ?? "oferta"}`,
      dueDate: dueDate.toISOString().slice(0, 10),
      externalReference: ofertaId ?? undefined,
    })

    const qr = await asaas.getPixQrCode(payment.id)
    return NextResponse.json({
      encodedImage: qr?.encodedImage ?? null,
      payload: qr?.payload ?? null,
      id: payment?.id ?? null,
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Erro ao criar pagamento" }, { status: 500 })
  }
}