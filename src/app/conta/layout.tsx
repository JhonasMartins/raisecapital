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
import { Bell, Mail, TrendingUp, CheckCircle2 } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: {
    template: "%s | Área do Investidor",
    default: "Área do Investidor",
  },
  description: "Gerencie seus investimentos, acompanhe rendimentos e acesse relatórios detalhados na sua área exclusiva do investidor.",
};

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  // Proteção server-side: exige sessão válida (cookie presente) para acessar qualquer rota dentro de /conta
  const cookieStore = await cookies();
  const hasSession = !!cookieStore.get("better-auth.session-token")?.value;
  if (!hasSession) {
    redirect("/auth/login?redirect=/conta");
  }

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
                  <button
                    className="relative hidden rounded-full p-2 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/40 sm:block"
                    aria-label="Notificações"
                    aria-haspopup="menu"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute -right-0.5 -top-0.5 inline-flex h-2.5 w-2.5 items-center justify-center rounded-full bg-primary ring-2 ring-background"></span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" side="bottom" className="w-[420px] p-0">
                  {/* Cabeçalho */}
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="text-xs font-medium text-muted-foreground">Notificações</span>
                    <button type="button" className="text-xs text-primary hover:underline">Marcar todas como lidas</button>
                  </div>
                  <DropdownMenuSeparator className="my-0" />

                  {/* Lista */}
                  <div className="max-h-80 overflow-auto p-1.5">
                    <Link href="/conta/notificacoes" className="group flex items-start gap-3 rounded-md p-2 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
                      <div className="relative">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-blue-600">
                          <Mail className="h-4 w-4" />
                        </div>
                        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-primary"></span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm text-foreground">3 novas mensagens da Raise Capital</div>
                        <div className="text-xs text-muted-foreground">Há 2h</div>
                      </div>
                    </Link>

                    <Link href="/conta/notificacoes" className="group mt-1.5 flex items-start gap-3 rounded-md p-2 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                        <TrendingUp className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm text-foreground">Atualização em um investimento</div>
                        <div className="text-xs text-muted-foreground">Ontem</div>
                      </div>
                    </Link>

                    <Link href="/conta/notificacoes" className="group mt-1.5 flex items-start gap-3 rounded-md p-2 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-600">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm text-foreground">Seus proventos foram creditados</div>
                        <div className="text-xs text-muted-foreground">Há 3 dias</div>
                      </div>
                    </Link>
                  </div>

                  <DropdownMenuSeparator className="my-0" />

                  {/* Rodapé */}
                  <div className="px-3 py-2">
                    <Link href="/conta/notificacoes" className="block text-center text-sm font-medium text-primary hover:underline">
                      Ver todas
                    </Link>
                  </div>
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
  );
}