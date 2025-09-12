import "server-only"

// Cliente mínimo para API Asaas v3
// Docs: Authentication and base URLs
// - Production: https://api.asaas.com/v3
// - Sandbox:    https://api-sandbox.asaas.com/v3

const BASE_URL = process.env.ASAAS_BASE_URL || "https://api.asaas.com/v3"
const API_KEY = process.env.ASAAS_API_KEY
const USER_AGENT = process.env.ASAAS_USER_AGENT || "raisecapital-app/1.0"

if (!API_KEY) {
  console.warn("[Asaas] ASAAS_API_KEY não definida. Configure no .env.local para habilitar integrações.")
}

export type AsaasRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  path: string
  query?: Record<string, string | number | boolean | undefined>
  body?: unknown
}

function buildUrl(path: string, query?: AsaasRequestOptions["query"]) {
  const url = new URL(path.replace(/^\/+/ , ""), BASE_URL.endsWith("/") ? BASE_URL : BASE_URL + "/")
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined) continue
      url.searchParams.set(k, String(v))
    }
  }
  return url.toString()
}

export async function asaasFetch<T = any>(opts: AsaasRequestOptions): Promise<T> {
  if (!API_KEY) throw new Error("ASAAS_API_KEY não configurada")
  const url = buildUrl(opts.path, opts.query)
  const res = await fetch(url, {
    method: opts.method || "GET",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": USER_AGENT,
      "access_token": API_KEY,
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    // Asaas é API externa; considere timeout via AbortController ao usar em produção pesada
    cache: "no-store",
  })

  if (!res.ok) {
    let errorPayload: any
    try { errorPayload = await res.json() } catch { errorPayload = await res.text() }
    const err = new Error(`[Asaas] ${res.status} ${res.statusText}: ${typeof errorPayload === 'string' ? errorPayload : JSON.stringify(errorPayload)}`)
    throw err
  }

  // Algumas rotas Asaas retornam 204 (sem body)
  const text = await res.text()
  if (!text) return undefined as unknown as T
  try { return JSON.parse(text) as T } catch { return text as unknown as T }
}

// ===== Tipagens e helpers para meios de pagamento =====
export type AsaasBillingType = "PIX" | "BOLETO" | "CREDIT_CARD"

export type CreatePaymentBase = {
  customer: string
  value: number
  billingType: AsaasBillingType
  description?: string
  dueDate?: string // YYYY-MM-DD
  externalReference?: string
}

export type CreatePixPayment = CreatePaymentBase & { billingType: "PIX" }
export type CreateBoletoPayment = CreatePaymentBase & { billingType: "BOLETO" }

// Para cartão, o Asaas aceita creditCardToken OU o objeto creditCard + creditCardHolderInfo
export type CreateCreditCardPayment = CreatePaymentBase & {
  billingType: "CREDIT_CARD"
  creditCardToken?: string
  creditCard?: {
    holderName: string
    number: string
    expiryMonth: string
    expiryYear: string
    ccv: string
  }
  creditCardHolderInfo?: {
    name: string
    email?: string
    cpfCnpj?: string
    mobilePhone?: string
    postalCode?: string
    addressNumber?: string
    addressComplement?: string
  }
}

export async function createPayment(payload: CreatePixPayment | CreateBoletoPayment | CreateCreditCardPayment) {
  return asaasFetch<any>({ method: "POST", path: "/payments", body: payload })
}

export const asaas = {
  // Busca cliente por CPF/CNPJ
  async getCustomerByCpfCnpj(cpfCnpj: string) {
    return asaasFetch<{ data: any[] }>({
      path: "/customers",
      query: { cpfCnpj },
    })
  },
  // Cria cliente
  async createCustomer(payload: any) {
    return asaasFetch<any>({ method: "POST", path: "/customers", body: payload })
  },
  // Cria cobrança (PIX/Boleto/Cartão — conforme payload)
  async createPayment(payload: any) {
    return asaasFetch<any>({ method: "POST", path: "/payments", body: payload })
  },
  // Gera QRCode PIX (paymentId)
  async getPixQrCode(paymentId: string) {
    return asaasFetch<any>({ path: `/payments/${paymentId}/pixQrCode` })
  },
}