'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { formatBRL } from '@/lib/utils'
import { AlertCircle } from 'lucide-react'

interface Offer {
  name: string
  min: number
  goal: number
  raised: number
}

interface InvestmentValuePageProps {
  params: Promise<{ slug: string }>
}

export default function InvestmentValuePage({ params }: InvestmentValuePageProps) {
  const router = useRouter()
  const [slug, setSlug] = useState<string>('')
  const [offer, setOffer] = useState<Offer | null>(null)
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params
      setSlug(resolvedParams.slug)
    }
    getParams()
  }, [params])

  useEffect(() => {
    if (!slug) return

    const fetchOffer = async () => {
      try {
        // Buscar dados da oferta (simulando com dados mock por enquanto)
        const mockOffers: Record<string, Offer> = {
          'fintech-xyz': {
            name: 'Fintech XYZ',
            min: 1000,
            goal: 500000,
            raised: 350000
          },
          'agrotech-verde': {
            name: 'Agrotech Verde',
            min: 500,
            goal: 300000,
            raised: 120000
          },
          'healthtech-vida': {
            name: 'HealthTech Vida',
            min: 2000,
            goal: 450000,
            raised: 450000
          }
        }

        const offerData = mockOffers[slug]
        if (offerData) {
          setOffer(offerData)
        } else {
          setError('Oferta não encontrada')
        }
      } catch (err) {
        setError('Erro ao carregar dados da oferta')
      } finally {
        setLoading(false)
      }
    }

    fetchOffer()
  }, [slug])

  const handleAmountChange = (value: string) => {
    // Remove caracteres não numéricos
    const numericValue = value.replace(/\D/g, '')
    setAmount(numericValue)
    setError('')
  }

  const handleContinue = () => {
    if (!offer) return

    const numericAmount = parseInt(amount)
    
    if (!amount || numericAmount <= 0) {
      setError('Por favor, insira um valor válido')
      return
    }

    if (numericAmount < offer.min) {
      setError(`O valor mínimo para investimento é ${formatBRL(offer.min)}`)
      return
    }

    // Salvar valor no localStorage para usar nas próximas etapas
    localStorage.setItem('investmentAmount', amount)
    localStorage.setItem('offerSlug', slug)
    
    // Navegar para próxima etapa
    router.push(`/investir/${slug}/dados`)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">Carregando...</div>
        </CardContent>
      </Card>
    )
  }

  if (!offer) {
    return (
      <Card>
        <CardContent className="p-8">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || 'Oferta não encontrada'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  const numericAmount = parseInt(amount) || 0
  const formattedAmount = numericAmount > 0 ? formatBRL(numericAmount) : ''

  return (
    <Card>
      <CardHeader>
        <CardTitle>Valor do Investimento</CardTitle>
        <p className="text-sm text-muted-foreground">
          Defina o valor que deseja investir em <strong>{offer.name}</strong>
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Informações da oferta */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Investimento mínimo</div>
            <div className="font-semibold">{formatBRL(offer.min)}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Meta</div>
            <div className="font-semibold">{formatBRL(offer.goal)}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Arrecadado</div>
            <div className="font-semibold">{formatBRL(offer.raised)}</div>
          </div>
        </div>

        {/* Campo de valor */}
        <div className="space-y-2">
          <Label htmlFor="amount">Valor do investimento (R$)</Label>
          <div className="relative">
            <Input
              id="amount"
              type="text"
              placeholder="0"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="text-lg font-medium"
            />
            {formattedAmount && (
              <div className="mt-2 text-sm text-muted-foreground">
                Valor formatado: {formattedAmount}
              </div>
            )}
          </div>
        </div>

        {/* Erro */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Botões */}
        <div className="flex justify-end">
          <Button 
            onClick={handleContinue}
            disabled={!amount || parseInt(amount) <= 0}
            size="lg"
          >
            Continuar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}