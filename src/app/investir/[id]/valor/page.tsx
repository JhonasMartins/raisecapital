'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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

    // Salvar valor no localStorage
    localStorage.setItem('investmentAmount', amount)
    localStorage.setItem('offerId', offerId)
    
    // Navegar para próxima página
    router.push(`/investir/${offerId}/dados`)
  }

  const handleBack = () => {
    router.push(`/ofertas/${offerId}`)
  }

  const formatInputValue = (value: string) => {
    if (!value) return ''
    const numericValue = parseInt(value)
    return formatBRL(numericValue)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando oferta...</p>
        </div>
      </div>
    )
  }

  if (error && !offer) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Erro ao carregar oferta</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => router.push('/ofertas')}>
            Voltar às ofertas
          </Button>
        </div>
      </div>
    )
  }

  if (!offer) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Oferta não encontrada</h2>
          <p className="text-muted-foreground mb-4">
            A oferta que você está procurando não existe ou foi removida.
          </p>
          <Button onClick={() => router.push('/ofertas')}>
            Voltar às ofertas
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <DollarSign className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold">Definir Valor do Investimento</h1>
        <p className="text-muted-foreground mt-2">
          Escolha o valor que deseja investir em <span className="font-semibold">{offer.name}</span>
        </p>
      </div>

      {/* Informações da Oferta */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Informações da Oferta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Valor Mínimo</p>
              <p className="text-lg font-bold text-green-600">
                {formatBRL(offer.min)}
              </p>
            </div>
            
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Meta</p>
              <p className="text-lg font-bold">
                {formatBRL(offer.goal)}
              </p>
            </div>
            
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Captado</p>
              <p className="text-lg font-bold">
                {formatBRL(offer.raised)}
              </p>
            </div>
          </div>

          {offer.tir && (
            <div className="flex items-center justify-center gap-2 p-3 bg-green-50 rounded-lg">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">
                TIR Projetada: <span className="text-green-600">{offer.tir}% a.a.</span>
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Formulário de Valor */}
      <Card>
        <CardHeader>
          <CardTitle>Valor do Investimento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Valor em Reais (R$)</Label>
            <div className="relative">
              <Input
                id="amount"
                type="text"
                placeholder="0,00"
                value={formatInputValue(amount)}
                onChange={(e) => handleAmountChange(e.target.value)}
                className="text-lg font-semibold pl-8"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                R$
              </span>
            </div>
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Valores Sugeridos */}
          <div className="space-y-2">
            <Label>Valores Sugeridos</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[offer.min, offer.min * 2, offer.min * 5, offer.min * 10].map((suggestedAmount) => (
                <Button
                  key={suggestedAmount}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(suggestedAmount.toString())}
                  className="text-xs"
                >
                  {formatBRL(suggestedAmount)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações Importantes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Informações Importantes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p>
                O investimento será processado após a confirmação dos dados e aceite dos termos.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p>
                Este é um investimento de risco. Leia atentamente todos os documentos antes de investir.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p>
                Você pode alterar o valor do investimento até a confirmação final.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botões de Ação */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar à Oferta
        </Button>
        
        <Button 
          onClick={handleContinue}
          disabled={!amount || parseInt(amount) <= 0}
          className="min-w-[120px]"
        >
          Continuar
        </Button>
      </div>
    </div>
  )
}