"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function EmpresaNav() {
  const pathname = usePathname() || "/empresa";

  const isActive = (match: (p: string) => boolean) =>
    match(pathname) ? "bg-primary/10 text-foreground ring-1 ring-primary/20" : "hover:bg-muted/60 hover:text-foreground";

  return (
    <nav className="hidden sm:flex items-center justify-center gap-2.5 text-sm text-muted-foreground">
      {/* Dashboard */}
      <Link
        href="/empresa"
        className={
          "relative rounded-md px-3.5 py-1.5 transition-colors outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary/40 " +
          isActive((p) => p === "/empresa")
        }
        aria-current={pathname === "/empresa" ? "page" : undefined}
      >
        Dashboard
      </Link>

      {/* Minhas ofertas (dropdown) */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={
              "relative rounded-md px-3.5 py-1.5 transition-colors outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary/40 " +
              isActive((p) => p.startsWith("/empresa/ofertas"))
            }
            aria-haspopup="menu"
          >
            Minhas ofertas
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          <DropdownMenuItem asChild>
            <Link href="/empresa/ofertas">Ativas</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/empresa/ofertas?status=encerradas">Encerradas</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/empresa/ofertas/nova">Nova oferta</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Investidores */}
      <Link
        href="/empresa/investidores"
        className={
          "relative rounded-md px-3.5 py-1.5 transition-colors outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary/40 " +
          isActive((p) => p.startsWith("/empresa/investidores"))
        }
        aria-current={pathname.startsWith("/empresa/investidores") ? "page" : undefined}
      >
        Investidores
      </Link>

      {/* Relatórios */}
      <Link
        href="/empresa/relatorios"
        className={
          "relative rounded-md px-3.5 py-1.5 transition-colors outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary/40 " +
          isActive((p) => p.startsWith("/empresa/relatorios"))
        }
        aria-current={pathname.startsWith("/empresa/relatorios") ? "page" : undefined}
      >
        Relatórios
      </Link>

      {/* Mais (dropdown) */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={
              "relative rounded-md px-3.5 py-1.5 transition-colors outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary/40 hover:bg-muted/60 hover:text-foreground"
            }
            aria-haspopup="menu"
          >
            Mais
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          <DropdownMenuItem asChild>
            <Link href="#" aria-label="Falar com consultor">Falar com consultor</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/empresa/perfil">Dados da Empresa</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/empresa/configuracoes">Configurações</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/empresa/documentos">Documentos</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/empresa/suporte">Suporte</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}