import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { query } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    // Estrutura padrão (últimos 6 meses)
    const now = new Date()
    const items: { label: string; aportes: number; rendimentos: number }[] = []

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const label = d.toLocaleString("pt-BR", { month: "short" })
      items.push({ label, aportes: 0, rendimentos: 0 })
    }

    try {
      // Caso existam tabelas aportes/rendimentos por mês
      const perf = await query<{ mes: number; ano: number; aportes: string | number; rendimentos: string | number }>(
        `SELECT EXTRACT(MONTH FROM data)::int as mes, EXTRACT(YEAR FROM data)::int as ano,
                COALESCE(SUM(CASE WHEN tipo = 'aporte' THEN valor END),0) AS aportes,
                COALESCE(SUM(CASE WHEN tipo = 'rendimento' THEN valor END),0) AS rendimentos
           FROM movimentos
          WHERE user_id = $1
            AND data >= (CURRENT_DATE - INTERVAL '6 months')
          GROUP BY 1,2
          ORDER BY 2,1`,
        [user.id]
      )

      const map = new Map<string, { aportes: number; rendimentos: number }>()
      for (const r of perf.rows) {
        const key = `${r.ano}-${String(r.mes).padStart(2, "0")}`
        map.set(key, { aportes: Number(r.aportes ?? 0), rendimentos: Number(r.rendimentos ?? 0) })
      }

      for (let i = 0; i < items.length; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
        const found = map.get(key)
        if (found) {
          items[i].aportes = found.aportes
          items[i].rendimentos = found.rendimentos
        }
      }
    } catch (e) {
      // fallback em branco
    }

    return NextResponse.json({ items })
  } catch (err) {
    console.error("GET /api/conta/performance error", err)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}