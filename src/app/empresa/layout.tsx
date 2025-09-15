import Image from "next/image";
import Link from "next/link";
import EmpresaNav from "../../components/empresa-nav";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MobileMenu from "@/components/mobile-menu";
import { Bell, Mail, TrendingUp, CheckCircle2, DollarSign } from "lucide-react";

export const metadata = {
  title: {
    template: "%s | Área da Empresa",
    default: "Área da Empresa",
  },
  description: "Gerencie suas ofertas, acompanhe captações e acesse relatórios detalhados na sua área exclusiva da empresa.",
};

export default function EmpresaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="min-h-svh bg-[#f7f9fc]">
        <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="mx-auto max-w-6xl px-6 flex h-16 items-center justify-between gap-4 sm:grid sm:grid-cols-[1fr_auto_1fr]">
            {/* Left: Logo apenas */}
            <div className="justify-self-start">
              <Link href="/empresa" className="inline-flex items-center" aria-label="Ir para a página de resumo da empresa">
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
              <EmpresaNav />
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
                    <Link href="/empresa/notificacoes" className="group flex items-start gap-3 rounded-md p-2 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
                      <div className="relative">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-blue-600">
                          <Mail className="h-4 w-4" />
                        </div>
                        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-primary"></span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm text-foreground">Nova mensagem de investidor interessado</div>
                        <div className="text-xs text-muted-foreground">Há 1h</div>
                      </div>
                    </Link>

                    <Link href="/empresa/notificacoes" className="group mt-1.5 flex items-start gap-3 rounded-md p-2 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
                        <DollarSign className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm text-foreground">Novo investimento recebido</div>
                        <div className="text-xs text-muted-foreground">Há 3h</div>
                      </div>
                    </Link>

                    <Link href="/empresa/notificacoes" className="group mt-1.5 flex items-start gap-3 rounded-md p-2 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-600">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm text-foreground">Documentação aprovada pela CVM</div>
                        <div className="text-xs text-muted-foreground">Ontem</div>
                      </div>
                    </Link>
                  </div>

                  {/* Rodapé */}
                  <DropdownMenuSeparator className="my-0" />
                  <div className="p-2">
                    <Link
                      href="/empresa/notificacoes"
                      className="block w-full rounded-md bg-muted/40 px-3 py-2 text-center text-xs font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                    >
                      Ver todas as notificações
                    </Link>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User menu (desktop) */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="relative hidden rounded-full p-2 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/40 sm:block"
                    aria-label="Menu do usuário"
                    aria-haspopup="menu"
                  >
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">E</span>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" side="bottom">
                  <DropdownMenuItem asChild>
                    <Link href="/empresa/perfil">Perfil da Empresa</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/empresa/configuracoes">Configurações</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/auth/logout">Sair</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-6 py-8">
          {children}
        </main>
      </div>
    </>
  );
}