import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Raise Capital — Investimentos em Equity Crowdfunding",
  description:
    "Plataforma de investimentos em equity crowdfunding. Conectamos você a oportunidades selecionadas com transparência e segurança.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}

        {/* Footer */}
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
                  Este website ("Site") é gerido e operado pela RAISE CAPITAL LTDA, com CNPJ 52.422.948/0001-39.
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
      </body>
    </html>
  );
}
