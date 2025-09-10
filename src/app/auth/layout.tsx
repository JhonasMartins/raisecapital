"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const centerPaths = new Set(["/auth/login", "/auth/recuperar-senha", "/auth/otp"]) // telas que devem ficar centralizadas
  const isCentered = centerPaths.has(pathname)

  // Gate de manutenção apenas para login e cadastro
  const gatePaths = new Set(["/auth/login", "/auth/criar-conta"]) 
  const [showGate, setShowGate] = useState(false)
  const [devPwd, setDevPwd] = useState("")
  const [unlocking, setUnlocking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // SHA-256 da senha fornecida, para não guardar a senha em texto puro
  const DEV_HASH = "073923644d5f4f9d311647c7077918da2c06f166fba67529e71bd3133ba10591"

  useEffect(() => {
    try {
      const shouldGate = gatePaths.has(pathname)
      const unlocked = typeof window !== "undefined" && localStorage.getItem("rcDevUnlock") === "1"
      setShowGate(shouldGate && !unlocked)
    } catch {
      setShowGate(gatePaths.has(pathname))
    }
  }, [pathname])

  async function sha256Hex(input: string): Promise<string> {
    const data = new TextEncoder().encode(input)
    const digest = await crypto.subtle.digest("SHA-256", data)
    return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("")
  }

  async function tryUnlock(e?: React.FormEvent) {
    if (e) e.preventDefault()
    setUnlocking(true)
    setError(null)
    try {
      const h = await sha256Hex(devPwd)
      if (h === DEV_HASH) {
        localStorage.setItem("rcDevUnlock", "1")
        setShowGate(false)
      } else {
        setError("Senha incorreta")
      }
    } finally {
      setUnlocking(false)
    }
  }

  return (
    <div className="fixed inset-0 grid md:grid-cols-2 overflow-hidden">
      {/* Aside azul à esquerda */}
      <aside className="relative hidden md:flex h-full overflow-hidden flex-col justify-between bg-[linear-gradient(180deg,#0B5ED7_0%,#0A58CA_100%)] p-10 text-white">
        <div>
          <Link href="/" className="inline-flex items-center" aria-label="Voltar ao início">
            <Image src="/logo.avif" alt="Raise Capital" width={180} height={44} sizes="180px" priority className="brightness-0 invert" />
          </Link>

          <div className="mt-14 max-w-md">
            <h2 className="text-4xl/tight font-semibold">Vamos configurar sua conta</h2>
            <p className="mt-4 text-white/80 text-sm">
              Uma experiência simples e direta para você entrar na plataforma e começar sua jornada com a Raise Capital.
            </p>
          </div>
        </div>

        {/* Depoimento */}
        <div className="rounded-xl bg-white/10 p-5 backdrop-blur-sm shadow-[0_8px_24px_rgba(0,0,0,0.15)]">
          <p className="text-base font-medium">“Processo rápido e sem complicação.”</p>
          <p className="mt-2 text-sm text-white/80">Em poucos minutos meu cadastro estava pronto e já pude acompanhar as oportunidades. Recomendo!</p>
          <div className="mt-4 flex items-center gap-3 text-sm">
            <div className="h-8 w-8 rounded-full bg-white/20" />
            <div>
              <p className="font-medium">C. Johns</p>
              <p className="text-white/70">Investidora</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Área do formulário à direita */}
      <section className={`h-full overflow-y-auto flex ${isCentered ? "items-center" : "items-start"} justify-center px-6 py-10 md:px-12`}>
        <div className="w-full max-w-2xl">
          {children}
        </div>
      </section>

      {showGate && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <h3 className="text-xl font-semibold">Sistema em atualização</h3>
              <p className="mt-2 text-sm text-gray-600">
                Estamos realizando uma atualização no ambiente de autenticação. Em breve voltamos.
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/" className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm hover:bg-gray-50">
                  Voltar ao início
                </Link>
              </div>

              <form onSubmit={tryUnlock} className="mt-6 space-y-2">
                <label htmlFor="devpwd" className="text-sm font-medium">Senha de desenvolvedor</label>
                <input
                  id="devpwd"
                  type="password"
                  value={devPwd}
                  onChange={(e) => setDevPwd(e.target.value)}
                  className="h-10 w-full rounded-md border px-3 text-sm outline-none focus:border-gray-400"
                  placeholder="Digite a senha para desbloquear"
                  autoFocus
                />
                {error && <p className="text-xs text-red-600">{error}</p>}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={unlocking}
                    className="inline-flex h-10 items-center justify-center rounded-md bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                  >
                    {unlocking ? "Verificando…" : "Entrar como desenvolvedor"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}