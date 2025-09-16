'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, DollarSign, TrendingUp, Clock, Shield, AlertCircle } from 'lucide-react'
import { formatBRL } from '@/lib/utils'

interface Offer {
  id?: string
  name: string
  category: string
  modality: string
  min: number
  raised: number
  goal: number
  deadline: string
  cover: string
  status: string
  tir?: number
}

interface ValorPageProps {
  params: { id: string }
}

export default function ValorPage({ params }: ValorPageProps) {
  const router = useRouter()
  const offerId = params.id as string
  const [offer, setOffer] = useState<Offer | null>(null)
  const [amount, setAmount] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [offer, setOffer] = useState<Offer | null>(null)
  const [amount, setAmount] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params?.id) {
      setOfferId(params.id as string)
    }
  }, [params])

  const fetchOffer = async (id: string) => {
    try {
      setLoading(true)
      setError('')
      
      // Buscar oferta real do banco de dados
      const response = await fetch(`/api/ofertas/${id}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Oferta não encontrada')
        } else {
          setError('Erro ao carregar oferta')
        }
        setLoading(false)
        return
      }
      
      const offerData = await response.json()
      setOffer(offerData)
    } catch (err) {
      console.error('Erro ao buscar oferta:', err)
      setError('Erro ao carregar oferta')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (offerId) {
      fetchOffer(offerId)
    }
  }, [offerId])

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
    localStorage.setItem('offerId', offerId)
    
    // Navegar para próxima etapa
    router.push(`/investir/${offerId}/dados`)
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