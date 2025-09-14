"use client"

import Link from "next/link";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function MobileMenu() {
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const pathname = usePathname()

  // Fecha automaticamente quando a rota muda
  useEffect(() => {
    if (detailsRef.current?.open) detailsRef.current.open = false
  }, [pathname])

  // Fecha ao clicar em qualquer item do menu
  function closeMenu() {
    if (detailsRef.current) detailsRef.current.open = false
  }

  return (
    <details ref={detailsRef} className="relative group sm:hidden">
      <summary className="appearance-none list-none inline-flex items-center justify-center rounded-md p-2 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 [&::-webkit-details-marker]:hidden [&::marker]:content-['']" aria-label="Abrir menu">
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </summary>
      <div className="absolute right-0 top-full mt-2 w-64 rounded-md border bg-popover text-popover-foreground shadow-md">
        <nav className="flex flex-col p-2 text-sm">
          <Link href="/conta" className="rounded px-3 py-2 hover:bg-accent/30" onClick={closeMenu}>Minha carteira</Link>
          <div className="my-1 h-px bg-border" />
          <span className="px-3 py-1.5 text-xs uppercase text-muted-foreground">Meus investimentos</span>
          <Link href="/conta/investimentos" className="rounded px-3 py-2 hover:bg-accent/30" onClick={closeMenu}>Em andamento</Link>
          <Link href="/conta/investimentos?status=liquidados" className="rounded px-3 py-2 hover:bg-accent/30" onClick={closeMenu}>Liquidados</Link>
          <div className="my-1 h-px bg-border" />
          <Link href="/conta/rendimentos" className="rounded px-3 py-2 hover:bg-accent/30" onClick={closeMenu}>Proventos</Link>
          <Link href="/conta/extratos" className="rounded px-3 py-2 hover:bg-accent/30" onClick={closeMenu}>Extrato</Link>
          <div className="my-1 h-px bg-border" />
          <span className="px-3 py-1.5 text-xs uppercase text-muted-foreground">Mais</span>
          <Link href="#" className="rounded px-3 py-2 hover:bg-accent/30" onClick={closeMenu}>Falar com especialista</Link>
          <Link href="/conta/perfil" className="rounded px-3 py-2 hover:bg-accent/30" onClick={closeMenu}>Dados Cadastrais</Link>
          <Link href="/conta/documentos" className="rounded px-3 py-2 hover:bg-accent/30" onClick={closeMenu}>Imposto de Renda</Link>
          <Link href="/material-didatico" className="rounded px-3 py-2 hover:bg-accent/30" onClick={closeMenu}>Conteúdos</Link>
          <Link href="/conta/assinaturas" className="rounded px-3 py-2 hover:bg-accent/30" onClick={closeMenu}>Grupos</Link>
          <div className="my-2 h-px bg-border" />
          <Link href="/ofertas" className="rounded px-3 py-2 font-medium hover:bg-accent/30" onClick={closeMenu}>Investir</Link>
          <div className="my-2 h-px bg-border" />
          <Link href="/conta/perfil" className="rounded px-3 py-2 hover:bg-accent/30" onClick={closeMenu}>Perfil</Link>
          <a href="mailto:contato@raisecapital.com" className="rounded px-3 py-2 hover:bg-accent/30" onClick={closeMenu}>Suporte</a>
          <Link href="/auth/login" className="rounded px-3 py-2 hover:bg-accent/30" onClick={closeMenu}>Sair da conta</Link>
        </nav>
      </div>
    </details>
  )
}