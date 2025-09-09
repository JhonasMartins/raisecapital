"use client"

import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

export default function FooterGate({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isAuth = pathname?.startsWith("/auth")
  if (isAuth) return null
  return <>{children}</>
}