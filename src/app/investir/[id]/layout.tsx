import { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface InvestmentLayoutProps {
  children: ReactNode
  params: Promise<{ slug: string }>
}

const steps = [
  { id: 'valor', title: 'Valor do Investimento', step: 1 },
  { id: 'dados', title: 'Confirmação de Dados', step: 2 },
  { id: 'termos', title: 'Termos e Declarações', step: 3 },
  { id: 'confirmacao', title: 'Confirmação', step: 4 },
]

export default async function InvestmentLayout({ children, params }: InvestmentLayoutProps) {
  const { slug } = await params
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header com botão voltar */}
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href={`/ofertas/${slug}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para a oferta
            </Link>
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Fluxo de Investimento</h1>
            <p className="text-muted-foreground">Complete as etapas abaixo para finalizar seu investimento</p>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-2 ${
                  index === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {step.step}
                </div>
                <span className="text-xs text-center text-muted-foreground hidden sm:block">
                  {step.title}
                </span>
              </div>
            ))}
          </div>
          <Progress value={25} className="h-2" />
        </div>

        {/* Main content */}
        <div className="max-w-2xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  )
}