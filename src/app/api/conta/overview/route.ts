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

    // Valores padrão (vazios) caso as tabelas ainda não existam
    let balanceAvailable = 0
    let investedTotal = 0
    let cumulativeReturnPct = 0
    let pendingContributions = 0

    // Tentar obter dados reais caso existam tabelas/visões no banco
    try {
      // Saldo disponível (ex: tabela wallets/saldos)
      const saldo = await query<{ value: string | number }>(
        "SELECT COALESCE(SUM(valor), 0) AS value FROM saldos WHERE user_id = $1 AND moeda = 'BRL'",
        [user.id]
      )
      balanceAvailable = Number(saldo.rows?.[0]?.value ?? 0)
    } catch (e) {
      // tabela pode não existir ainda
    }

    try {
      // Posição investida (ex: tabela investimentos)
      const pos = await query<{ value: string | number }>(
        "SELECT COALESCE(SUM(valor_aplicado), 0) AS value FROM investimentos WHERE user_id = $1",
        [user.id]
      )
      investedTotal = Number(pos.rows?.[0]?.value ?? 0)
    } catch (e) {}

    try {
      // Rentabilidade acumulada (ex: visão que agrega PnL)
      const rent = await query<{ pct: string | number }>(
        "SELECT COALESCE(SUM(rendimento), 0) / NULLIF(SUM(valor_aplicado),0) * 100 AS pct FROM investimentos WHERE user_id = $1",
        [user.id]
      )
      cumulativeReturnPct = Number(rent.rows?.[0]?.pct ?? 0) || 0
    } catch (e) {}

    try {
      // Aportes pendentes (ex: tabela aportes a liquidar)
      const ap = await query<{ value: string | number }>(
        "SELECT COALESCE(SUM(valor), 0) AS value FROM aportes WHERE user_id = $1 AND status = 'pendente'",
        [user.id]
      )
      pendingContributions = Number(ap.rows?.[0]?.value ?? 0)
    } catch (e) {}

    return NextResponse.json({
      balanceAvailable,
      investedTotal,
      cumulativeReturnPct,
      pendingContributions,
    })
  } catch (err) {
    console.error("GET /api/conta/overview error", err)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}