"use client"

import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

export default function FooterGate({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const hideChrome =
    pathname?.startsWith("/auth") ||
    pathname?.startsWith("/painel") ||
    pathname?.startsWith("/conta") ||
    pathname?.startsWith("/empresa")
  if (hideChrome) return null
  return <>{children}</>
}