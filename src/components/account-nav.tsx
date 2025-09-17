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

export default function AccountNav() {
  const pathname = usePathname() || "/conta";

  const isActive = (match: (p: string) => boolean) =>
    match(pathname) ? "bg-primary/10 text-foreground ring-1 ring-primary/20" : "hover:bg-muted/60 hover:text-foreground";

  return (
    <nav className="hidden sm:flex items-center justify-center gap-2.5 text-sm text-muted-foreground">
      {/* Minha carteira */}
      <Link
        href="/conta"
        className={
          "relative rounded-md px-3.5 py-1.5 transition-colors outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary/40 " +
          isActive((p) => p === "/conta")
        }
        aria-current={pathname === "/conta" ? "page" : undefined}
      >
        Minha carteira
      </Link>

      {/* Meus investimentos (dropdown) */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={
              "relative rounded-md px-3.5 py-1.5 transition-colors outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary/40 " +
              isActive((p) => p.startsWith("/conta/investimentos"))
            }
            aria-haspopup="menu"
          >
            Meus investimentos
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          <DropdownMenuItem asChild>
            <Link href="/conta/investimentos">Em andamento</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/conta/investimentos?status=liquidados">Liquidados</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Proventos */}
      <Link
        href="/conta/rendimentos"
        className={
          "relative rounded-md px-3.5 py-1.5 transition-colors outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary/40 " +
          isActive((p) => p.startsWith("/conta/rendimentos"))
        }
        aria-current={pathname.startsWith("/conta/rendimentos") ? "page" : undefined}
      >
        Proventos
      </Link>

      {/* Extrato */}
      <Link
        href="/conta/extratos"
        className={
          "relative rounded-md px-3.5 py-1.5 transition-colors outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary/40 " +
          isActive((p) => p.startsWith("/conta/extratos"))
        }
        aria-current={pathname.startsWith("/conta/extratos") ? "page" : undefined}
      >
        Extrato
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
            <Link href="#" aria-label="Falar com especialista">Falar com especialista</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/conta/perfil">Dados Cadastrais</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/conta/imposto">Imposto de Renda</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/material-didatico">Conteúdos</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/conta/assinaturas">Grupos</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* CTA Investir */}
      <Button asChild className="ml-1">
        <Link href="/ofertas">Investir</Link>
      </Button>
    </nav>
  );
}