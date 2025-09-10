import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { slugify } from '@/lib/utils'

export const dynamic = 'force-dynamic'

type PostBody = {
  name: string
  category: string
  modality: string
  min: number
  goal: number
  raised?: number
  deadline?: string | null
  deadlineDate?: string | null
  cover: string
  status?: string
  subtitle?: string | null
  product?: string | null
  payment?: string | null
  tir?: string | null
  summaryPdf?: string | null
  aboutOperation?: string | null
  aboutCompany?: string | null
  entrepreneurs?: unknown[]
  financials?: unknown[]
  documents?: unknown[]
  essentialInfo?: unknown[]
  investors?: unknown[]
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<PostBody>
    const {
      name,
      category,
      modality,
      min,
      goal,
      raised = 0,
      deadline, // texto livre (ex.: "30 dias")
      deadlineDate, // YYYY-MM-DD
      cover,
      status = 'Em captação',
      // extras
      subtitle,
      product,
      payment,
      tir,
      summaryPdf,
      aboutOperation,
      aboutCompany,
      entrepreneurs,
      financials,
      documents,
      essentialInfo,
      investors,
    } = body

    if (!name || !category || !modality || typeof min !== 'number' || typeof goal !== 'number' || !cover) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
    }

    const db = getDb()
    let baseSlug = slugify(name)
    let finalSlug = baseSlug

    // Tentar inserir; em caso de slug duplicado, adicionar sufixo numérico simples
    let attempt = 0
    while (true) {
      try {
        const { rows } = await db.query<{ id: number; slug: string }>(
          `INSERT INTO ofertas (
            nome, slug, categoria, modalidade, minimo_investimento, arrecadado, meta, data_limite, prazo_texto, capa, status,
            subtitulo, produto, pagamento, tir, resumo_pdf, sobre_operacao, sobre_empresa,
            empreendedores, financeiros, documentos, informacoes_essenciais, investidores
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,
                    $12,$13,$14,$15,$16,$17,$18,
                    $19,$20,$21,$22,$23)
          RETURNING id, slug` as string,
          [
            name,
            finalSlug,
            category,
            modality,
            min,
            raised ?? 0,
            goal,
            deadlineDate || null,
            deadline ?? null,
            cover,
            status,
            // extras
            subtitle ?? null,
            product ?? null,
            payment ?? null,
            tir ?? null,
            summaryPdf ?? null,
            aboutOperation ?? null,
            aboutCompany ?? null,
            JSON.stringify(entrepreneurs ?? []),
            JSON.stringify(financials ?? []),
            JSON.stringify(documents ?? []),
            JSON.stringify(essentialInfo ?? []),
            JSON.stringify(investors ?? []),
          ] as const
        )
        const created = rows[0]
        return NextResponse.json({ ok: true, id: created.id, slug: created.slug })
      } catch (e: unknown) {
-        const msg = (e as any)?.message || ''
-        // código de violação de unicidade (pg) pode não estar sempre presente; usar mensagem
-        const isUnique = (e as any)?.code === '23505' || /duplicate key value/i.test(msg)
+        const msg = e && typeof e === 'object' && 'message' in e ? String((e as { message?: unknown }).message) : ''
+        // código de violação de unicidade (pg) pode não estar sempre presente; usar mensagem
+        const code = e && typeof e === 'object' && 'code' in e ? String((e as { code?: unknown }).code) : ''
+        const isUnique = code === '23505' || /duplicate key value/i.test(msg)
         if (isUnique && attempt < 3) {
           attempt += 1
           finalSlug = `${baseSlug}-${attempt}`
           continue
         }
         console.error('POST /api/ofertas error', e)
         return NextResponse.json({ error: 'Erro ao salvar' }, { status: 500 })
       }
    }
  } catch (e) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

// Added: GET handler to list offers
export async function GET(req: Request) {
  try {
    const db = getDb()
    const url = new URL(req.url)
    const q = (url.searchParams.get('q') || '').trim().toLowerCase()
    const category = url.searchParams.get('category') || ''
    const modality = url.searchParams.get('modality') || ''

    const filters: string[] = []
    const params: unknown[] = []

    if (q) {
      params.push(`%${q}%`)
      filters.push(`LOWER(nome) LIKE $${params.length}`)
    }
    if (category) {
      params.push(category)
      filters.push(`categoria = $${params.length}`)
    }
    if (modality) {
      params.push(modality)
      filters.push(`modalidade = $${params.length}`)
    }

    const where = filters.length ? `WHERE ${filters.join(' AND ')}` : ''
    const { rows } = await db.query<{
      nome: string
      slug: string
      categoria: string
      modalidade: string
      minimo_investimento: number | string | null
      arrecadado: number | string | null
      meta: number | string | null
      data_limite: Date | string | null
      prazo_texto: string | null
      capa: string | null
      status: string | null
    }>(
      `SELECT nome, slug, categoria, modalidade, minimo_investimento, arrecadado, meta, data_limite, prazo_texto, capa, status
       FROM ofertas
       ${where}
       ORDER BY created_at DESC`,
      params
    )

    const items = (rows || []).map((r) => {
      const deadline: string = r.prazo_texto
        ? String(r.prazo_texto)
        : (r.data_limite instanceof Date
            ? r.data_limite.toISOString().slice(0, 10)
            : (typeof r.data_limite === 'string' ? r.data_limite : ''))
      return {
        name: r.nome,
        slug: r.slug,
        category: r.categoria,
        modality: r.modalidade,
        min: Number(r.minimo_investimento ?? 0),
        raised: Number(r.arrecadado ?? 0),
        goal: Number(r.meta ?? 0),
        deadline,
        cover: r.capa ?? '/file.svg',
        status: r.status ?? 'Em captação',
      }
    })

    return NextResponse.json({ items })
  } catch (e) {
    console.error('GET /api/ofertas error', e)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}