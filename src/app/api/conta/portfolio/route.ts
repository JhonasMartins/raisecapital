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

    // Estrutura padrão vazia
    let allocation: { label: string; value: number }[] = []

    try {
      // Busca de alocação por classe de ativo caso exista tabela "alocacoes"
      const res = await query<{ classe: string; valor: string | number }>(
        "SELECT classe, COALESCE(SUM(valor),0) AS valor FROM alocacoes WHERE user_id = $1 GROUP BY classe ORDER BY classe",
        [user.id]
      )
      allocation = res.rows.map((r) => ({ label: r.classe, value: Number(r.valor) }))
    } catch (e) {
      // fallback vazio
    }

    return NextResponse.json({ allocation })
  } catch (err) {
    console.error("GET /api/conta/portfolio error", err)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}