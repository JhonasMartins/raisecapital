'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, CreditCard, FileText, QrCode } from 'lucide-react'

interface InvestmentData {
  amount: number
  offerName: string
}

export default function ConfirmacaoPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string
  
  const [investmentData, setInvestmentData] = useState<InvestmentData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Recuperar dados do localStorage
    const amountData = localStorage.getItem('investmentAmount')
    const userData = localStorage.getItem('investmentUserData')
    const termsData = localStorage.getItem('investmentTermsData')
    
    if (amountData && userData && termsData) {
      const amount = JSON.parse(amountData)
      
      // Mock do nome da oferta baseado no slug
      const offerNames: { [key: string]: string } = {
        'startup-tech': 'TechStart Inovação',
        'green-energy': 'Green Energy Solutions',
        'fintech-brasil': 'FinTech Brasil',
        'default': 'Oferta de Investimento'
      }
      
      setInvestmentData({
        amount: amount,
        offerName: offerNames[slug] || offerNames['default']
      })
    } else {
      // Se não há dados, redirecionar para o início
      router.push(`/investir/${slug}/valor`)
    }
    
    setIsLoading(false)
  }, [slug, router])

  const handlePaymentOption = (method: string) => {
    // Aqui você implementaria a lógica para cada método de pagamento
    console.log(`Método de pagamento selecionado: ${method}`)
    
    // Por enquanto, apenas mostrar um alert
    alert(`Redirecionando para pagamento via ${method}`)
    
    // Em uma implementação real, você redirecionaria para a página de pagamento específica
    // router.push(`/pagamento/${method}?investmentId=${investmentId}`)
  }

  const handleFinalizarPagamento = () => {
    // Limpar dados do localStorage após finalizar
    localStorage.removeItem('investmentAmount')
    localStorage.removeItem('investmentUserData')
    localStorage.removeItem('investmentTermsData')
    
    // Redirecionar para dashboard ou página de sucesso
    router.push('/dashboard')
  }

  const handlePrevious = () => {
    router.push(`/investir/${slug}/termos`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  if (!investmentData) {
    return (
      <div className="text-center">
        <p>Erro ao carregar dados do investimento.</p>
        <Button onClick={() => router.push(`/investir/${slug}/valor`)} className="mt-4">
          Reiniciar processo
        </Button>
      </div>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-green-600 mb-2">
          Reserva Realizada com Sucesso!
        </h1>
        <p className="text-lg text-muted-foreground">
          Sua reserva de investimento no valor de{' '}
          <span className="font-semibold text-primary">
            {formatCurrency(investmentData.amount)}
          </span>
          {' '}na oferta{' '}
          <span className="font-semibold text-primary">
            {investmentData.offerName}
          </span>
          {' '}foi realizada com sucesso!
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Opções de Pagamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Escolha uma das opções abaixo para finalizar seu pagamento:
          </p>
          
          <div className="grid gap-4">
            {/* Boleto Bancário */}
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handlePaymentOption('Boleto Bancário')}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <div>
                    <h3 className="font-semibold">Boleto Bancário</h3>
                    <p className="text-sm text-muted-foreground">
                      Pagamento em até 3 dias úteis
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">Disponível</Badge>
              </CardContent>
            </Card>

            {/* PIX */}
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handlePaymentOption('PIX')}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <QrCode className="h-6 w-6 text-green-600" />
                  <div>
                    <h3 className="font-semibold">PIX</h3>
                    <p className="text-sm text-muted-foreground">
                      Pagamento instantâneo 24h
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">Recomendado</Badge>
              </CardContent>
            </Card>

            {/* Cartão de Crédito */}
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handlePaymentOption('Cartão de Crédito')}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-6 w-6 text-purple-600" />
                  <div>
                    <h3 className="font-semibold">Cartão de Crédito</h3>
                    <p className="text-sm text-muted-foreground">
                      Pagamento parcelado disponível
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">Disponível</Badge>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resumo do Investimento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Oferta:</span>
              <span className="font-medium">{investmentData.offerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Valor do investimento:</span>
              <span className="font-medium">{formatCurrency(investmentData.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Reserva confirmada
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-muted p-4 rounded-lg">
        <h4 className="font-semibold mb-2">Próximos passos:</h4>
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li>• Realize o pagamento através de uma das opções acima</li>
          <li>• Após a confirmação do pagamento, você receberá um e-mail de confirmação</li>
          <li>• Acompanhe o progresso do seu investimento no dashboard</li>
          <li>• Você receberá atualizações regulares sobre a empresa investida</li>
        </ul>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={handlePrevious}>
          Anterior
        </Button>
        <Button onClick={handleFinalizarPagamento} size="lg" className="px-8">
          Finalizar Pagamento
        </Button>
      </div>
    </div>
  )
}