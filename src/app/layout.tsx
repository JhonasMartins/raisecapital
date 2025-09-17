import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";
import FooterGate from "@/components/footer-gate";
import { Button } from "@/components/ui/button";
import Script from "next/script";
import NavMobile from "@/components/nav-mobile";
import { getCurrentUser } from '@/lib/auth';
import NavUser from '@/components/nav-user';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const interMono = Inter({
  variable: "--font-inter-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "Raise Capital — Investimento Coletivo em Participações (Equity)",
    template: "%s | Raise Capital"
  },
  description: "Conectamos investidores a ofertas públicas de empresas em crescimento por meio de investimento coletivo em participações (equity). Curadoria, transparência de documentos e indicadores, e jornada digital de ponta a ponta — em conformidade com a regulação brasileira.",
  keywords: [
    "equity crowdfunding",
    "investimento coletivo",
    "investimentos em empresas",
    "startups",
    "pequenas e médias empresas",
    "ofertas públicas",
    "investimentos alternativos",
    "plataforma de investimentos",
    "CVM",
    "crowdfunding de investimento"
  ],
  authors: [{ name: "Raise Capital" }],
  creator: "Raise Capital",
  publisher: "Raise Capital",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://raisecapital.com.br'),
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: '/',
    title: 'Raise Capital — Investimento Coletivo em Equity para empresas em crescimento',
    description: 'Invista em empresas em crescimento por meio de investimento coletivo em participações (equity). Curadoria, transparência e conformidade regulatória.',
    siteName: 'Raise Capital',
    images: [
      {
        url: '/background-hero.png',
        width: 1200,
        height: 630,
        alt: 'Raise Capital — Investimento Coletivo em Participações (Equity)',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Raise Capital — Investimento Coletivo em Participações (Equity)',
    description: 'Conectamos investidores a empresas em crescimento com curadoria, transparência e conformidade regulatória.',
    images: ['/background-hero.png'],
    creator: '@raisecapitalbr',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${interMono.variable} font-sans antialiased`}>

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
              <NavMobile />

              {/* Ações desktop (somente em sm+) */}
              <div className="hidden sm:flex items-center gap-3">
                <NavUser user={currentUser} />
              </div>
            </div>

          </div>
        </header>
      </FooterGate>

      {children}

        {/* JSON-LD Structured Data */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Raise Capital",
              "description": "Plataforma de investimento coletivo em participações (equity) que conecta investidores a empresas privadas em crescimento, com curadoria e conformidade regulatória no Brasil.",
              "url": "https://raisecapital.com.br",
              "logo": "https://raisecapital.com.br/logo.avif",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+55-11-5286-3852",
                "contactType": "customer service",
                "email": "contato@raisecapital.com",
                "availableLanguage": "Portuguese"
              },
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Av. Horacio Lafer, 160",
                "addressLocality": "São Paulo",
                "addressRegion": "SP",
                "postalCode": "04538-080",
                "addressCountry": "BR"
              },
              "sameAs": [
                "https://linkedin.com/company/raisecapital",
                "https://twitter.com/raisecapitalbr"
              ],
              "foundingDate": "2024",
              "numberOfEmployees": "10-50",
              "industry": "Financial Services",
              "serviceArea": {
                "@type": "Country",
                "name": "Brazil"
              }
            })
          }}
        />

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
                    Plataforma de investimento coletivo em participações (equity) que conecta investidores a empresas em crescimento, com curadoria, transparência e conformidade regulatória.
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

              <div className="mt-10 flex items-center justify-between border-t pt-8 text-xs text-muted-foreground">
                <p>© {new Date().getFullYear()} Raise Capital LTDA — CNPJ 54.049.553/0001-60</p>
                <div className="flex items-center gap-2">
                  <Link href="/privacidade" className="hover:text-foreground">Privacidade</Link>
                  <span aria-hidden="true">•</span>
                  <Link href="/termos" className="hover:text-foreground">Termos</Link>
                </div>
              </div>
            </div>
          </footer>
        </FooterGate>

        {/* Banner de cookies (apenas demonstração) */}
        {/* <div className="fixed bottom-4 left-0 right-0 mx-auto max-w-6xl px-6">
          <div className="rounded-xl border bg-card p-4 sm:flex sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">Usamos cookies para melhorar sua experiência. Ao continuar, você concorda com nossa <Link href="/privacidade" className="underline">política de cookies</Link>.</p>
            <div className="mt-3 flex gap-2 sm:mt-0">
              <Button size="sm" variant="secondary">Preferências</Button>
              <Button size="sm">Aceitar</Button>
            </div>
          </div>
        </div> */}

      </body>
    </html>
  );
}
