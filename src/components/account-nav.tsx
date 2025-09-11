"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/conta", label: "Minha carteira", match: (p: string) => p === "/conta" },
  { href: "/conta/investimentos", label: "Meus investimentos", match: (p: string) => p.startsWith("/conta/investimentos") },
  { href: "/conta/extratos", label: "Extrato", match: (p: string) => p.startsWith("/conta/extratos") },
  { href: "/conta/rendimentos", label: "Proventos", match: (p: string) => p.startsWith("/conta/rendimentos") },
  { href: "/conta/documentos", label: "Documentos", match: (p: string) => p.startsWith("/conta/documentos") },
  { href: "/conta/suitability", label: "Suitability", match: (p: string) => p.startsWith("/conta/suitability") },
  { href: "/conta/assinaturas", label: "Assinaturas", match: (p: string) => p.startsWith("/conta/assinaturas") },
  { href: "/conta/pagamentos", label: "Pagamentos", match: (p: string) => p.startsWith("/conta/pagamentos") },
];

export default function AccountNav() {
  const pathname = usePathname() || "/conta";

  return (
    <nav className="hidden sm:flex items-center justify-center gap-2.5 text-sm text-muted-foreground">
      {items.map(({ href, label, match }) => {
        const active = match(pathname);
        return (
          <Link
            key={href}
            href={href}
            className={
              "relative rounded-md px-3.5 py-1.5 transition-colors outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-primary/40 " +
              (active
                ? "bg-primary/10 text-foreground ring-1 ring-primary/20"
                : "hover:bg-muted/60 hover:text-foreground")
            }
            aria-current={active ? "page" : undefined}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}