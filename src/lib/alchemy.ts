import "server-only"
import { Alchemy, Network, type AlchemySettings, AssetTransfersCategory, SortingOrder } from "alchemy-sdk"

export type SupportedNetwork = "eth-mainnet" | "eth-sepolia"

const NETWORK_MAP: Record<SupportedNetwork, Network> = {
  "eth-mainnet": Network.ETH_MAINNET,
  "eth-sepolia": Network.ETH_SEPOLIA,
}

function getApiKeyForNetwork(net: SupportedNetwork): string | undefined {
  const specific =
    net === "eth-mainnet"
      ? process.env.ALCHEMY_API_KEY_ETH_MAINNET
      : process.env.ALCHEMY_API_KEY_ETH_SEPOLIA
  return specific || process.env.ALCHEMY_API_KEY
}

export function getAlchemy(network: SupportedNetwork = "eth-mainnet"): Alchemy {
  const apiKey = getApiKeyForNetwork(network)
  if (!apiKey) {
    throw new Error(
      `[Alchemy] API key ausente. Defina ALCHEMY_API_KEY ou ALCHEMY_API_KEY_${network
        .replace("-", "_")
        .toUpperCase()} no ambiente.`
    )
  }

  const settings: AlchemySettings = {
    apiKey,
    network: NETWORK_MAP[network],
    maxRetries: 3,
  }
  return new Alchemy(settings)
}

export function isHexAddress(input: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(input)
}

export async function resolveToAddress(
  input: string,
  network: SupportedNetwork = "eth-mainnet"
): Promise<{ address: string; resolvedFrom?: string | null }> {
  const alchemy = getAlchemy(network)
  if (isHexAddress(input)) return { address: input, resolvedFrom: null }

  // Tenta resolver ENS (apenas redes Ethereum)
  const addr = await alchemy.core.resolveName(input)
  if (!addr) {
    throw new Error(`Não foi possível resolver o identificador informado: ${input}`)
  }
  return { address: addr, resolvedFrom: input }
}

export async function getNativeBalanceWei(address: string, network: SupportedNetwork) {
  const alchemy = getAlchemy(network)
  const bal = await alchemy.core.getBalance(address, "latest")
  return bal.toString()
}

export type TokenBalanceItem = {
  contractAddress: string
  tokenBalance: string // hex string
}

export async function getErcTokenBalances(
  address: string,
  network: SupportedNetwork
): Promise<TokenBalanceItem[]> {
  const alchemy = getAlchemy(network)
  const { tokenBalances } = await alchemy.core.getTokenBalances(address)
  return (tokenBalances || [])
    .filter((t): t is { contractAddress: string; tokenBalance: string; error: null } => t.tokenBalance !== null)
    .map((t) => ({ contractAddress: t.contractAddress, tokenBalance: t.tokenBalance }))
}

export async function getOwnedNfts(
  address: string,
  network: SupportedNetwork
) {
  const alchemy = getAlchemy(network)
  const res = await alchemy.nft.getNftsForOwner(address, { pageSize: 50 })
  return {
    totalCount: res.totalCount ?? res.ownedNfts?.length ?? 0,
    items: (res.ownedNfts || []).map((n) => ({
      contractAddress: n.contract?.address || "",
      tokenId: n.tokenId,
      title: n.name || n.contract?.name || null,
      raw: {
        contract: n.contract?.address,
        tokenType: n.tokenType,
        collection: n.contract?.name,
      },
    })),
  }
}

export async function getTransfers(
  address: string,
  network: SupportedNetwork
) {
  const alchemy = getAlchemy(network)
  const categories: AssetTransfersCategory[] = [
    AssetTransfersCategory.EXTERNAL,
    AssetTransfersCategory.INTERNAL,
    AssetTransfersCategory.ERC20,
    AssetTransfersCategory.ERC721,
    AssetTransfersCategory.ERC1155,
  ]

  const [outgoing, incoming] = await Promise.all([
    alchemy.core.getAssetTransfers({
      fromAddress: address,
      category: categories,
      order: SortingOrder.DESCENDING,
    }),
    alchemy.core.getAssetTransfers({
      toAddress: address,
      category: categories,
      order: SortingOrder.DESCENDING,
    }),
  ])

  const merged = [...(outgoing.transfers || []), ...(incoming.transfers || [])]
  merged.sort((a, b) => {
    const ab = parseInt((a.blockNum || "0x0").toString(), 16)
    const bb = parseInt((b.blockNum || "0x0").toString(), 16)
    return bb - ab
  })
  return merged.slice(0, 50)
}

export function parseNetworkParam(input?: string | null): SupportedNetwork {
  const val = (input || "").toLowerCase().replace(/_/g, "-")
  switch (val) {
    case "mainnet":
    case "eth-mainnet":
      return "eth-mainnet"
    case "sepolia":
    case "eth-sepolia":
      return "eth-sepolia"
    default:
      return "eth-mainnet"
  }
}