'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, AlertCircle, ArrowLeft, FileText, Lock } from 'lucide-react'

interface InvestmentSummary {
  offerName: string
  amount: number
  userData: any
  termsData: any
}

export default function ConfirmacaoPage() {
  const router = useRouter()
  const params = useParams()
  const offerId = params.id as string
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [offer, setOffer] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<InvestmentSummary | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const checkAuthentication = async () => {
    try {
      // Simular verificação de autenticação
      const isAuth = localStorage.getItem('userToken') !== null
      setIsAuthenticated(isAuth)
    } catch (error) {
      setIsAuthenticated(false)
    }
  }

  const fetchOffer = async () => {
    try {
      // Simular busca da oferta
      const mockOffer = { id: offerId, status: 'ativa', name: 'Fintech XYZ' }
      setOffer(mockOffer)
    } catch (error) {
      console.error('Erro ao buscar oferta:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuthentication()
    fetchOffer()
  }, [offerId])

  useEffect(() => {
    // Carregar dados do localStorage
    const amount = localStorage.getItem('investmentAmount')
    const userData = localStorage.getItem('investmentData')
    const termsData = localStorage.getItem('investmentTermsData')
    
    if (amount && userData && termsData) {
      setSummary({
        offerName: 'Fintech XYZ', // Mock - deveria vir da API
        amount: parseFloat(amount),
        userData: JSON.parse(userData),
        termsData: JSON.parse(termsData)
      })
    }
  }, [])

  const handleConfirm = async () => {
    // Verificar autenticação
    if (!isAuthenticated) {
      alert('Você precisa estar logado para confirmar o investimento.')
      return
    }

    // Verificar status da oferta
    if (offer && (offer.status === 'encerrada' || offer.status === 'finalizada')) {
      alert('Esta oferta já foi encerrada e não aceita mais investimentos.')
      return
    }

    setIsSubmitting(true)
    
    try {
      // Simular envio para API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Limpar localStorage
      localStorage.removeItem('investmentAmount')
      localStorage.removeItem('investmentData')
      localStorage.removeItem('investmentTermsData')
      localStorage.removeItem('offerId')
      
      // Redirecionar para página de sucesso ou dashboard
      router.push('/dashboard?success=investment')
    } catch (error) {
      console.error('Erro ao confirmar investimento:', error)
      alert('Erro ao processar investimento. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    router.push(`/investir/${offerId}/termos`)
  }

  const handleEditAmount = () => {
    router.push(`/investir/${offerId}/valor`)
  }

  // Tela de carregamento
  if (loading || isAuthenticated === null) {
    return (
      <div className="text-center py-8">
        <p>Carregando...</p>
      </div>
    )
  }

  // Tela de login para usuários não autenticados
  if (!loading && isAuthenticated === false) {
    return (
      <div className="text-center py-8 space-y-4">
        <Lock className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Login Necessário</h2>
        <p className="text-muted-foreground">
          Você precisa estar logado para confirmar o investimento.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => router.push('/auth/login')}>
            Fazer Login
          </Button>
          <Button variant="outline" onClick={() => router.push('/auth/criar-conta')}>
            Criar Conta
          </Button>
          <Button variant="ghost" onClick={() => router.push('/ofertas')}>
            Voltar às Ofertas
          </Button>
        </div>
      </div>
    )
  }

  // Alerta para oferta encerrada
  if (!loading && isAuthenticated && offer && (offer.status === 'encerrada' || offer.status === 'finalizada')) {
    return (
      <div className="text-center py-8 space-y-4">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
        <h2 className="text-xl font-semibold">Oferta Encerrada</h2>
        <p className="text-muted-foreground">
          Esta oferta já foi finalizada e não aceita mais investimentos.
        </p>
        <Button onClick={() => router.push('/ofertas')}>
          Ver Outras Ofertas
        </Button>
      </div>
    )
  }

  if (!summary) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Dados não encontrados</h2>
          <p className="text-muted-foreground mb-4">
            Não foi possível carregar os dados do investimento.
          </p>
          <Button onClick={() => router.push(`/investir/${offerId}/valor`)}>
            Voltar ao início
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold">Confirmação do Investimento</h1>
        <p className="text-muted-foreground mt-2">
          Revise os dados do seu investimento antes de finalizar
        </p>
      </div>

      {/* Resumo do Investimento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Resumo do Investimento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Oferta:</span>
            <span>{summary.offerName}</span>
          </div>
          
          <Separator />
          
          <div className="flex justify-between items-center">
            <span className="font-medium">Valor do Investimento:</span>
            <div className="text-right">
              <div className="text-lg font-bold text-green-600">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(summary.amount)}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleEditAmount}
                className="p-0 h-auto text-xs"
              >
                Alterar valor
              </Button>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <span className="font-medium">Investidor:</span>
            <div className="text-sm text-muted-foreground">
              <p>{summary.userData.nome} {summary.userData.sobrenome}</p>
              <p>{summary.userData.email}</p>
              <p>CPF: {summary.userData.cpf}</p>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <span className="font-medium">Perfil de Investidor:</span>
            <Badge variant="secondary">
              {summary.termsData.perfilInvestidor === 'superior_1_milhao' && 'Investimentos > R$ 1 milhão'}
              {summary.termsData.perfilInvestidor === 'superior_200_mil' && 'Investimentos/Renda > R$ 200 mil'}
              {summary.termsData.perfilInvestidor === 'inferior_200_mil' && 'Investimentos/Renda < R$ 200 mil'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Termos Aceitos */}
      <Card>
        <CardHeader>
          <CardTitle>Termos Aceitos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">Termo de Ciência de Risco aceito</span>
          </div>
        </CardContent>
      </Card>

      {/* Botões de Ação */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={handleBack} disabled={isSubmitting}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        
        <Button 
          onClick={handleConfirm} 
          disabled={isSubmitting || (offer && (offer.status === 'encerrada' || offer.status === 'finalizada'))}
          className="min-w-[120px]"
        >
          {isSubmitting ? 'Processando...' : 
           offer && (offer.status === 'encerrada' || offer.status === 'finalizada') ? 'Oferta Encerrada' : 
           'Confirmar Investimento'}
        </Button>
      </div>
    </div>
  )
}