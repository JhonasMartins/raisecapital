import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-dvh pt-28">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <h1 className="text-2xl font-semibold">Oferta não encontrada</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          A oferta que você procura pode ter sido removida ou o endereço está incorreto.
        </p>
        <div className="mt-6">
          <Link href="/ofertas" className="text-sm hover:underline">Voltar para ofertas</Link>
        </div>
      </div>
    </div>
  )
}