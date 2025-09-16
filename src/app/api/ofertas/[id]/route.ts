import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export const dynamic = 'force-dynamic'

interface Params {
  id: string
}

export async function GET(req: Request, { params }: { params: Params }) {
  try {
    const { id } = params
    
    if (!id) {
      return NextResponse.json({ error: 'ID da oferta é obrigatório' }, { status: 400 })
    }

    const db = getDb()
    const { rows } = await db.query(
      `SELECT 
        id,
        nome as name,
        categoria as category,
        modalidade as modality,
        minimo_investimento as min,
        arrecadado as raised,
        meta as goal,
        prazo_texto as deadline,
        capa as cover,
        status,
        subtitulo as subtitle,
        produto as product,
        pagamento as payment,
        tir,
        resumo_pdf as summaryPdf,
        sobre_operacao as aboutOperation,
        sobre_empresa as aboutCompany,
        empreendedores as entrepreneurs,
        financeiros as financials,
        documentos as documents,
        informacoes_essenciais as essentialInfo,
        investidores as investors
       FROM ofertas 
       WHERE id = $1 
       LIMIT 1`,
      [id]
    )

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Oferta não encontrada' }, { status: 404 })
    }

    const offer = rows[0]
    
    // Converter valores numéricos
    const formattedOffer = {
      ...offer,
      min: offer.min ? parseFloat(offer.min) : 0,
      raised: offer.raised ? parseFloat(offer.raised) : 0,
      goal: offer.goal ? parseFloat(offer.goal) : 0,
      tir: offer.tir ? parseFloat(offer.tir) : null,
      // Parse JSON fields se necessário
      entrepreneurs: offer.entrepreneurs ? (typeof offer.entrepreneurs === 'string' ? JSON.parse(offer.entrepreneurs) : offer.entrepreneurs) : [],
      financials: offer.financials ? (typeof offer.financials === 'string' ? JSON.parse(offer.financials) : offer.financials) : [],
      documents: offer.documents ? (typeof offer.documents === 'string' ? JSON.parse(offer.documents) : offer.documents) : [],
      essentialInfo: offer.essentialInfo ? (typeof offer.essentialInfo === 'string' ? JSON.parse(offer.essentialInfo) : offer.essentialInfo) : [],
      investors: offer.investors ? (typeof offer.investors === 'string' ? JSON.parse(offer.investors) : offer.investors) : []
    }

    return NextResponse.json(formattedOffer)
  } catch (error) {
    console.error('Erro ao buscar oferta por ID:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}