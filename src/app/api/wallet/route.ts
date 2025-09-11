import { NextRequest } from "next/server"
import { getAlchemy, parseNetworkParam, resolveToAddress, getNativeBalanceWei, getErcTokenBalances, getOwnedNfts, getTransfers } from "@/lib/alchemy"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const network = parseNetworkParam(searchParams.get("network"))
    const input = searchParams.get("address") || ""
    if (!input) {
      return new Response(JSON.stringify({ error: "Parâmetro 'address' é obrigatório." }), { status: 400 })
    }

    // Valida API key cedo para retornar erro claro
    getAlchemy(network)

    const { address, resolvedFrom } = await resolveToAddress(input, network)

    const [wei, ercTokens, nfts, transfers] = await Promise.all([
      getNativeBalanceWei(address, network),
      getErcTokenBalances(address, network),
      getOwnedNfts(address, network),
      getTransfers(address, network),
    ])

    return new Response(
      JSON.stringify({
        network,
        address,
        resolvedFrom,
        native: { wei },
        ercTokens,
        nfts,
        transfers,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    )
  } catch (err: any) {
    const msg = err?.message || "Erro desconhecido"
    const code = /api key|ausente|obrigatório/i.test(msg) ? 400 : 500
    return new Response(JSON.stringify({ error: msg }), {
      status: code,
      headers: { "Content-Type": "application/json" },
    })
  }
}