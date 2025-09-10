import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import FooterGate from "@/components/footer-gate";
import { Button } from "@/components/ui/button";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3002";
const siteName = "Raise Capital";
const siteTitle = `${siteName} — Investimentos em Equity Crowdfunding`;
const siteDescription =
  "Plataforma de investimentos em equity crowdfunding. Conectamos você a oportunidades selecionadas com transparência e segurança.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  applicationName: siteName,
  generator: "Next.js",
  keywords: [
    "equity crowdfunding",
    "investimento",
    "startups",
    "ofertas",
    "plataforma de investimentos",
    "Raise Capital",
  ],
  alternates: {
    canonical: "/",
  },
  category: "Investimentos",
  openGraph: {
    type: "website",
    url: "/",
    siteName,
    title: siteTitle,
    description: siteDescription,
    locale: "pt_BR",
    images: [
      {
        url: "/background-hero.png",
        width: 1200,
        height: 630,
        alt: `${siteName} — Investimentos em Equity Crowdfunding`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/background-hero.png"],
    creator: "@raisecapital",
  },
  robots: {
    index: true,
    follow: true,
  },
  themeColor: "#0B5ED7",
  icons: {
    icon: "/favicon.svg",
  },
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
    logo: `${siteUrl}/favicon.svg`,
    sameAs: [
      "https://www.linkedin.com/company/raisecapital-br/",
    ],
  } as const;

  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/ofertas?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  } as const;

  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* JSON-LD base */}
        <Script id="ld-org" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
        <Script id="ld-website" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }} />

        {/* Navbar (oculta em /auth via FooterGate) */}
        <FooterGate>
          <header className="sticky top-0 inset-x-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between sm:grid sm:grid-cols-[1fr_auto_1fr] sm:justify-normal">
              {/* Logo à esquerda */}
              <div className="flex items-center justify-start shrink-0">
                <Link href="/" className="flex items-center" aria-label="Ir para a página inicial">
                  <Image src="/logo.avif" alt="Raise Capital" width={180} height={44} sizes="(max-width: 640px) 112px, 180px" className="block h-8 w-auto sm:h-10" priority />
                </Link>
              </div>

              {/* Menu central - desktop */}
              <nav className="hidden sm:flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <Link href="/" className="hover:text-foreground transition-colors">Início</Link>
                <Link href="/ofertas" className="hover:text-foreground transition-colors">Investimentos</Link>
                <Link href="/capte-recursos" className="hover:text-foreground transition-colors">Captar</Link>
                <Link href="/#investidores" className="hover:text-foreground transition-colors">Como funcionar</Link>
                <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
              </nav>

              {/* Ações à direita */}
              <div className="flex items-center justify-end gap-3">
                {/* Menu mobile (apenas no mobile) */}
                <div className="sm:hidden">
                  <details className="group relative z-[60]">
                    <summary className="list-none inline-flex items-center justify-center rounded-md p-2 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50" aria-label="Abrir menu">
                      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                      </svg>
                    </summary>
                    <div className="absolute right-0 top-full mt-2 w-[78vw] max-w-xs rounded-md border bg-popover text-popover-foreground shadow-md outline-none">
                      <nav className="flex flex-col p-2 text-sm">
                        <Link href="/" className="rounded px-3 py-2 hover:bg-accent hover:text-accent-foreground">Início</Link>
                        <Link href="/ofertas" className="rounded px-3 py-2 hover:bg-accent hover:text-accent-foreground">Investimentos</Link>
                        <Link href="/capte-recursos" className="rounded px-3 py-2 hover:bg-accent hover:text-accent-foreground">Captar</Link>
                        <Link href="/#investidores" className="rounded px-3 py-2 hover:bg-accent hover:text-accent-foreground">Como funcionar</Link>
                        <Link href="/blog" className="rounded px-3 py-2 hover:bg-accent hover:text-accent-foreground">Blog</Link>
                        <div className="my-2 h-px bg-border" />
                        <Link href="/auth/login" className="rounded px-3 py-2 hover:bg-accent hover:text-accent-foreground">Entrar</Link>
                        <Button asChild className="mt-1">
                          <Link href="/auth/criar-conta">Criar Conta</Link>
                        </Button>
                      </nav>
                    </div>
                  </details>
                </div>

                {/* Ações desktop (somente em sm+) */}
                <div className="hidden sm:flex items-center gap-3">
                  <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Entrar</Link>
                  <Button asChild>
                    <Link href="/auth/criar-conta">Criar Conta</Link>
                  </Button>
                </div>
              </div>

            </div>
          </header>
        </FooterGate>

        {children}

        {/* Footer (oculto em rotas /auth via FooterGate) */}
        <FooterGate>
          <footer className="border-t bg-background">
            <div className="mx-auto max-w-6xl px-6 py-12">
              <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
                {/* Logo + Descrição */}
                <div>
                  <div className="flex items-center">
                    <div className="relative h-10 w-40 md:h-12 md:w-48">
                      <Image src="/logo.avif" alt="Raise Capital" fill className="object-contain" />
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    Plataforma de crowdfunding de investimento no Brasil que conecta investidores a projetos promissores e de alto impacto.
                  </p>
                </div>

                {/* Links */}
                <div>
                  <h4 className="text-sm font-medium">Links</h4>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <li><Link href="/" className="hover:text-foreground hover:underline">Início</Link></li>
                    <li><Link href="/#sobre" className="hover:text-foreground hover:underline">Serviços</Link></li>
                    <li><Link href="/#investidores" className="hover:text-foreground hover:underline">Investidores</Link></li>
                    <li><Link href="/#empreendedores" className="hover:text-foreground hover:underline">Empreendedores</Link></li>
                  </ul>
                </div>

                {/* Legal */}
                <div>
                  <h4 className="text-sm font-medium">Legal</h4>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <li><Link href="/termos" className="hover:text-foreground hover:underline">Termos e condições de uso</Link></li>
                    <li><Link href="/privacidade" className="hover:text-foreground hover:underline">Política de Privacidade</Link></li>
                    <li><Link href="/codigo-de-conduta" className="hover:text-foreground hover:underline">Código de conduta</Link></li>
                    <li><Link href="/material-didatico" className="hover:text-foreground hover:underline">Material Didático</Link></li>
                  </ul>
                </div>

                {/* Contato */}
                <div>
                  <h4 className="text-sm font-medium">Contato</h4>
                  <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <li><a href="tel:+551152863852" className="hover:text-foreground hover:underline">+55 (11) 5286-3852</a></li>
                    <li><a href="mailto:contato@raisecapital.com" className="hover:text-foreground hover:underline">contato@raisecapital.com</a></li>
                    <li className="leading-relaxed">Av. Horacio Lafer, 160 - Itaim Bibi São Paulo - SP, 04538-080</li>
                  </ul>
                </div>
              </div>

              {/* Aviso regulatório + CVM + Créditos */}
              <div className="mt-10 border-t pt-6">
                <div className="text-xs leading-relaxed text-muted-foreground">
                  <p>
                    Este website (&quot;Site&quot;) é gerido e operado pela RAISE CAPITAL LTDA, com CNPJ 52.422.948/0001-39.
                  </p>
                  <p className="mt-3">
                    As sociedades empresárias de pequeno porte e as ofertas apresentadas nesta plataforma estão automaticamente dispensadas de registro pela Comissão de Valores Mobiliários - CVM. A CVM não analisa previamente as ofertas. As ofertas realizadas não implicam por parte da CVM a garantia da veracidade das informações prestadas, de adequação à legislação vigente ou julgamento sobre a qualidade da sociedade empresária de pequeno porte. Antes de aceitar uma oferta leia com atenção as informações essenciais da oferta, em especial a seção de alertas sobre riscos.
                  </p>
                </div>

                {/* Logo CVM */}
                <div className="mt-6 flex justify-center">
                  <Image src="/cvm.webp" alt="CVM" width={96} height={96} className="h-10 w-auto md:h-12" />
                </div>

                {/* Créditos */}
                <div className="mt-6 flex flex-col items-center justify-between gap-4 text-xs text-muted-foreground md:flex-row">
                  <p>© {new Date().getFullYear()} Raise Capital</p>
                  <p>
                    Desenvolvido por <a href="https://codnodo.com" className="hover:underline" target="_blank" rel="noopener noreferrer">Codnodo Studio</a>
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </FooterGate>
      </body>
    </html>
  );
}
