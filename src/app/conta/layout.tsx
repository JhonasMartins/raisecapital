import Image from "next/image";
import Link from "next/link";
import AccountNav from "@/components/account-nav";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MobileMenu from "@/components/mobile-menu";

export const metadata = {
  title: {
    template: "%s | Área do Investidor",
    default: "Área do Investidor",
  },
  description: "Gerencie seus investimentos, acompanhe rendimentos e acesse relatórios detalhados na sua área exclusiva do investidor.",
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="min-h-svh bg-[#f7f9fc]">
        <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="mx-auto max-w-6xl px-6 flex h-16 items-center justify-between gap-4 sm:grid sm:grid-cols-[1fr_auto_1fr]">
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
              <MobileMenu />

              {/* Bell (desktop) */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative hidden rounded-full p-2 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/40 sm:block" aria-label="Notificações" aria-haspopup="menu">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <path d="M12 2a6 6 0 00-6 6v3.586l-1.707 1.707A1 1 0 005 15h14a1 1 0 00.707-1.707L18 11.586V8a6 6 0 00-6-6z" />
                      <path d="M8 16a4 4 0 008 0H8z" />
                    </svg>
                    <span className="absolute -right-0.5 -top-0.5 inline-flex h-2.5 w-2.5 items-center justify-center rounded-full bg-primary ring-2 ring-background"></span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" side="bottom" className="w-72">
                  <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">Notificações</div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/conta/notificacoes">3 novas mensagens da Raise Capital</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/conta/notificacoes">Atualização em um investimento</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/conta/notificacoes">Seus proventos foram creditados</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/conta/notificacoes" className="font-medium">Ver todas</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Avatar (desktop) */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hidden items-center gap-2 rounded-full p-1.5 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/40 sm:flex" aria-label="Abrir perfil" aria-haspopup="menu">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">JL</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" side="bottom" className="min-w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/conta/perfil">Perfil</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="mailto:contato@raisecapital.com">Suporte</a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/auth/login">Sair da conta</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Header da página junto do card */}
        <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </>
  )
}