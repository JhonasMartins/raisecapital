import Image from "next/image";
import Link from "next/link";
import AccountNav from "@/components/account-nav";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const metadata = {
  title: {
    default: "Área do Investidor — Raise Capital",
    template: "%s | Área do Investidor",
  },
}

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="min-h-svh bg-[#f7f9fc]">
        <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="mx-auto max-w-6xl px-6 grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-4">
            {/* Left: Logo apenas */}
            <div className="justify-self-start">
              <Link href="/conta" className="inline-flex items-center" aria-label="Ir para a página de resumo da conta">
                <Image
                  src="/logo.avif"
                  alt="Raise Capital"
                  width={180}
                  height={44}
                  sizes="(max-width: 640px) 112px, 180px"
                  priority
                  className="block h-8 w-auto sm:h-10"
                />
              </Link>
            </div>

            {/* Center: Menu desktop completamente centralizado */}
            <div className="hidden justify-self-center sm:block">
              <AccountNav />
            </div>

            {/* Right: Ações (mobile menu / desktop icons) */}
            <div className="flex items-center justify-self-end gap-2">
              {/* Mobile menu */}
              <details className="relative group sm:hidden">
                <summary className="appearance-none list-none inline-flex items-center justify-center rounded-md p-2 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 [&::-webkit-details-marker]:hidden [&::marker]:content-['']" aria-label="Abrir menu">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                </summary>
                <div className="absolute right-0 top-full mt-2 w-56 rounded-md border bg-popover text-popover-foreground shadow-md">
                  <nav className="flex flex-col p-2 text-sm">
                    <Link href="/conta" className="rounded px-3 py-2 hover:bg-accent/30">Minha carteira</Link>
                    <Link href="/conta/investimentos" className="rounded px-3 py-2 hover:bg-accent/30">Meus investimentos</Link>
                    <Link href="/conta/extratos" className="rounded px-3 py-2 hover:bg-accent/30">Extrato</Link>
                    <Link href="/conta/rendimentos" className="rounded px-3 py-2 hover:bg-accent/30">Proventos</Link>
                    <Link href="/conta/documentos" className="rounded px-3 py-2 hover:bg-accent/30">Documentos</Link>
                    <Link href="/conta/suitability" className="rounded px-3 py-2 hover:bg-accent/30">Suitability</Link>
                    <Link href="/conta/assinaturas" className="rounded px-3 py-2 hover:bg-accent/30">Assinaturas</Link>
                    <Link href="/conta/pagamentos" className="rounded px-3 py-2 hover:bg-accent/30">Pagamentos</Link>
                  </nav>
                </div>
              </details>

              {/* Bell (desktop) */}
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="relative hidden rounded-full p-2 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/40 sm:block" aria-label="Notificações">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                        <path d="M12 2a6 6 0 00-6 6v3.586l-1.707 1.707A1 1 0 005 15h14a1 1 0 00.707-1.707L18 11.586V8a6 6 0 00-6-6z" />
                        <path d="M8 16a4 4 0 008 0H8z" />
                      </svg>
                      <span className="absolute -right-0.5 -top-0.5 inline-flex h-2.5 w-2.5 items-center justify-center rounded-full bg-primary ring-2 ring-background"></span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Notificações</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Avatar (desktop) */}
              <button className="hidden items-center gap-2 rounded-full p-1.5 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/40 sm:flex" aria-label="Abrir perfil">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">JL</span>
              </button>
            </div>
          </div>
        </header>

        {/* Header da página junto do card */}
        <main className="mx-auto max-w-6xl px-6 py-6">
          {children}
        </main>
      </div>
    </>
  )
}