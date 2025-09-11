"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function NavMobile() {
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
    <div className="sm:hidden">
      <details ref={detailsRef} className="group relative z-[60]">
        <summary
          className="list-none inline-flex items-center justify-center rounded-md p-2 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          aria-label="Abrir menu"
        >
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </summary>
        <div className="absolute right-0 top-full mt-2 w-[78vw] max-w-xs rounded-md border bg-popover text-popover-foreground shadow-md outline-none">
          <nav className="flex flex-col p-2 text-sm">
            <Link href="/" className="rounded px-3 py-2 hover:bg-accent hover:text-accent-foreground" onClick={closeMenu}>
              Início
            </Link>
            <Link href="/ofertas" className="rounded px-3 py-2 hover:bg-accent hover:text-accent-foreground" onClick={closeMenu}>
              Investimentos
            </Link>
            <Link href="/capte-recursos" className="rounded px-3 py-2 hover:bg-accent hover:text-accent-foreground" onClick={closeMenu}>
              Captar
            </Link>
            <Link href="/#investidores" className="rounded px-3 py-2 hover:bg-accent hover:text-accent-foreground" onClick={closeMenu}>
              Como funcionar
            </Link>
            <Link href="/blog" className="rounded px-3 py-2 hover:bg-accent hover:text-accent-foreground" onClick={closeMenu}>
              Blog
            </Link>
            <div className="my-2 h-px bg-border" />
            <Link href="/auth/login" className="rounded px-3 py-2 hover:bg-accent hover:text-accent-foreground" onClick={closeMenu}>
              Entrar
            </Link>
            <Button asChild className="mt-1">
              <Link href="/auth/criar-conta" onClick={closeMenu}>Criar Conta</Link>
            </Button>
          </nav>
        </div>
      </details>
    </div>
  )
}