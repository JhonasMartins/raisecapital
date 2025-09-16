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

    // Defaults
    let checksPassing = 0
    let checksRequired = 0
    let assignedPct = 0

    try {
      const res = await query<{ status: string; total: string | number }>(
        "SELECT status, COUNT(*)::int as total FROM compliance_checks WHERE user_id = $1 GROUP BY status",
        [user.id]
      )
      let done = 0
      let all = 0
      for (const r of res.rows) {
        const n = Number(r.total ?? 0)
        all += n
        if ((r.status ?? "").toLowerCase() === "aprovado" || (r.status ?? "").toLowerCase() === "ok") {
          done += n
        }
      }
      checksPassing = done
      checksRequired = all
      assignedPct = all > 0 ? Math.round((done / all) * 100) : 0
    } catch (e) {
      // fallback: vazio
    }

    return NextResponse.json({ checksPassing, checksRequired, assignedPct })
  } catch (err) {
    console.error("GET /api/conta/checks error", err)
    return NextResponse.json({ error: "Erro interno" }, { status: 500 })
  }
}