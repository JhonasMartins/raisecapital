import Image from "next/image"
import Link from "next/link"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 grid md:grid-cols-2 overflow-hidden">
      {/* Aside azul à esquerda */}
      <aside className="relative hidden md:flex h-full overflow-hidden flex-col justify-between bg-[linear-gradient(180deg,#0B5ED7_0%,#0A58CA_100%)] p-10 text-white">
        <div>
          <Link href="/" className="inline-flex items-center" aria-label="Voltar ao início">
            <Image src="/logo.avif" alt="Raise Capital" width={180} height={44} sizes="180px" priority className="brightness-0 invert" />
          </Link>

          <div className="mt-14 max-w-md">
            <h2 className="text-4xl/tight font-semibold">Vamos configurar sua conta</h2>
            <p className="mt-4 text-white/80 text-sm">
              Uma experiência simples e direta para você entrar na plataforma e começar sua jornada com a Raise Capital.
            </p>
          </div>
        </div>

        {/* Depoimento */}
        <div className="rounded-xl bg-white/10 p-5 backdrop-blur-sm shadow-[0_8px_24px_rgba(0,0,0,0.15)]">
          <p className="text-base font-medium">“Processo rápido e sem complicação.”</p>
          <p className="mt-2 text-sm text-white/80">Em poucos minutos meu cadastro estava pronto e já pude acompanhar as oportunidades. Recomendo!</p>
          <div className="mt-4 flex items-center gap-3 text-sm">
            <div className="h-8 w-8 rounded-full bg-white/20" />
            <div>
              <p className="font-medium">C. Johns</p>
              <p className="text-white/70">Investidora</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Área do formulário à direita */}
      <section className="h-full overflow-y-auto flex items-start justify-center px-6 py-10 md:px-12">
        <div className="w-full max-w-2xl">
          {children}
        </div>
      </section>
    </div>
  )
}