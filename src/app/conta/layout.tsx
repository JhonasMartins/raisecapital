import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: {
    default: "Área do Investidor — Raise Capital",
    template: "%s | Área do Investidor",
  },
}

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 inset-x-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-6xl h-16 px-6 grid grid-cols-[auto_1fr_auto] items-center gap-4">
          {/* Logo esquerda */}
          <div className="flex items-center">
            <Link href="/" aria-label="Ir para a página inicial">
              <Image src="/logo.avif" alt="Raise Capital" width={180} height={44} className="block h-8 w-auto sm:h-10" priority />
            </Link>
          </div>

          {/* Menu central */}
          <nav className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <Link href="/conta" className="hover:text-foreground transition-colors">Resumo</Link>
            <Link href="/conta/investimentos" className="hover:text-foreground transition-colors">Investimentos</Link>
            <Link href="/conta/extratos" className="hover:text-foreground transition-colors">Extratos</Link>
            <Link href="/conta/rendimentos" className="hover:text-foreground transition-colors">Rendimentos</Link>
            <Link href="/conta/documentos" className="hover:text-foreground transition-colors">Documentos</Link>
            <Link href="/conta/suitability" className="hover:text-foreground transition-colors">Suitability</Link>
            <Link href="/conta/assinaturas" className="hover:text-foreground transition-colors">Assinaturas</Link>
            <Link href="/conta/pagamentos" className="hover:text-foreground transition-colors">Pagamentos</Link>
          </nav>

          {/* Ações direita: Avatar + Notificações */}
          <div className="flex items-center gap-2 justify-self-end">
            {/* Avatar */}
            <details className="relative group">
              <summary className="appearance-none list-none inline-flex items-center justify-center rounded-full h-9 w-9 bg-accent text-accent-foreground ring-1 ring-border hover:bg-accent/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 [&::-webkit-details-marker]:hidden [&::marker]:content-['']" aria-label="Abrir perfil">
                <span className="sr-only">Abrir perfil</span>
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </summary>
              <div className="absolute right-0 top-full mt-2 w-56 rounded-md border bg-popover text-popover-foreground shadow-md">
                <nav className="flex flex-col p-2 text-sm">
                  <Link href="/conta/seguranca" className="rounded px-3 py-2 hover:bg-accent">Perfil</Link>
                  <Link href="/suporte" className="rounded px-3 py-2 hover:bg-accent">Suporte</Link>
                  <button className="rounded px-3 py-2 text-left hover:bg-accent">Sair</button>
                </nav>
              </div>
            </details>

            {/* Bell */}
            <details className="relative group">
              <summary className="appearance-none list-none inline-flex items-center justify-center rounded-md p-2 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 [&::-webkit-details-marker]:hidden [&::marker]:content-['']" aria-label="Notificações">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6 6 0 1 0-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </summary>
              <div className="absolute right-0 top-full mt-2 w-[86vw] max-w-sm rounded-md border bg-popover text-popover-foreground shadow-md">
                <div className="p-2 text-sm">
                  <div className="flex items-center justify-between px-2 py-1">
                    <span className="font-medium">Notificações</span>
                    <Link href="/conta/notificacoes" className="text-xs text-muted-foreground hover:text-foreground">Ver mais</Link>
                  </div>
                  <div className="my-1 h-px bg-border" />
                  <div className="space-y-1">
                    <div className="flex items-center justify-between rounded px-2 py-2 hover:bg-accent">
                      <div className="text-sm">Você tem um documento para assinar</div>
                      <button className="text-xs text-muted-foreground hover:text-foreground">Arquivar</button>
                    </div>
                    <div className="flex items-center justify-between rounded px-2 py-2 hover:bg-accent">
                      <div className="text-sm">Comprovante de PIX aprovado</div>
                      <button className="text-xs text-muted-foreground hover:text-foreground">Arquivar</button>
                    </div>
                  </div>
                </div>
              </div>
            </details>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {children}
      </main>
    </>
  )
}