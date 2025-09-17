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
  const [payment, setPayment] = useState<any>(null)
  // Adicionar seleção de forma de pagamento e estados de cartão
  const [billingType, setBillingType] = useState<'PIX' | 'BOLETO' | 'CREDIT_CARD'>('PIX')
  const [card, setCard] = useState({ holderName: '', number: '', expiryMonth: '', expiryYear: '', ccv: '' })
  const [cardHolder, setCardHolder] = useState({
    name: '',
    email: '',
    cpfCnpj: '',
    mobilePhone: '',
    postalCode: '',
    addressNumber: '',
    addressComplement: ''
  })

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

  // Prefill dados do titular do cartão com base nos dados do usuário
  useEffect(() => {
    if (summary?.userData) {
      const u = summary.userData || {}
      setCardHolder((prev) => ({
        ...prev,
        name: `${u?.nome ?? ''} ${u?.sobrenome ?? ''}`.trim(),
        email: u?.email ?? '',
        cpfCnpj: String(u?.cpf ?? '').replace(/\D/g, ''),
        mobilePhone: String(u?.telefone ?? '').replace(/\D/g, ''),
        postalCode: String(u?.cep ?? '').replace(/\D/g, ''),
        addressNumber: String(u?.numero ?? ''),
        addressComplement: String(u?.complemento ?? ''),
      }))
    }
  }, [summary])

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

    if (!summary) {
      alert('Dados do investimento não encontrados.')
      return
    }

    setIsSubmitting(true)
    setPayment(null)

    try {
      // 1) Atualizar dados cadastrais do usuário
      const profileRes = await fetch('/api/account/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(summary.userData)
      })
      if (!profileRes.ok) {
        const err = await profileRes.json().catch(() => ({}))
        throw new Error(err?.error || 'Falha ao atualizar dados cadastrais')
      }

      // 2) Criar link de pagamento
      const payload: any = { 
        ofertaId: offerId, 
        valor: summary.amount, 
        billingType,
        description: `Investimento - ${summary.offerName}`,
        externalReference: `oferta_${offerId}_${Date.now()}`
      }

      const payRes = await fetch('/api/asaas/create-payment-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!payRes.ok) {
        const err = await payRes.json().catch(() => ({}))
        throw new Error(err?.error || 'Falha ao criar link de pagamento')
      }
      const payData = await payRes.json()
      setPayment(payData)

      // Limpar localStorage depois de gerar o pagamento
      localStorage.removeItem('investmentAmount')
      localStorage.removeItem('investmentData')
      localStorage.removeItem('investmentTermsData')
      localStorage.removeItem('offerId')
    } catch (error: any) {
      console.error('Erro ao confirmar investimento:', error)
      alert(error?.message || 'Erro ao processar investimento. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const confirmLabel = 'Confirmar e Gerar Link de Pagamento'

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

          <Separator />

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleBack} disabled={isSubmitting}>Voltar</Button>
            <Button onClick={handleConfirm} disabled={isSubmitting}>{isSubmitting ? 'Processando...' : confirmLabel}</Button>
          </div>
        </CardContent>
      </Card>

      {/* LINK DE PAGAMENTO */}
      {payment?.paymentLink && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Link de Pagamento Criado
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 mb-3">
                Seu link de pagamento foi criado com sucesso! Clique no botão abaixo para acessar a página de pagamento do Asaas.
              </p>
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={() => window.open(payment.paymentLink.url, '_blank')}
                  className="w-full"
                >
                  Acessar Página de Pagamento
                </Button>
                <div className="text-xs text-green-700 space-y-1">
                  <p><strong>ID do Link:</strong> {payment.paymentLink.id}</p>
                  <p><strong>Valor:</strong> R$ {payment.paymentLink.value?.toFixed(2)}</p>
                  {payment.paymentLink.expirationDate && (
                    <p><strong>Expira em:</strong> {new Date(payment.paymentLink.expirationDate).toLocaleDateString('pt-BR')}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="secondary" onClick={() => router.push('/conta/investimentos')}>
                Ir para Meus Investimentos
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* PIX */}
      {payment?.billingType === 'PIX' && (payment?.encodedImage || payment?.payload) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Pagamento PIX
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {payment?.encodedImage && (
              <div className="flex flex-col items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={payment.encodedImage} alt="QR Code PIX" className="h-64 w-64" />
                <p className="text-sm text-muted-foreground">Escaneie o QR Code para pagar</p>
              </div>
            )}
            {payment?.payload && (
              <div className="space-y-2">
                <span className="font-medium text-sm">Copia e Cola:</span>
                <div className="rounded border p-2 text-xs break-all bg-muted/30">{payment.payload}</div>
                <div className="flex justify-end">
                  <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(payment.payload)}>Copiar</Button>
                </div>
              </div>
            )}
            <div className="flex justify-end">
              <Button variant="secondary" onClick={() => router.push('/conta/investimentos')}>Ir para Meus Investimentos</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* BOLETO */}
      {payment?.billingType === 'BOLETO' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Boleto Bancário
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {payment?.identificationField && (
              <div className="space-y-2">
                <span className="font-medium text-sm">Linha Digitável:</span>
                <div className="rounded border p-2 text-xs break-all bg-muted/30">{payment.identificationField}</div>
                <div className="flex justify-end">
                  <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(payment.identificationField)}>Copiar</Button>
                </div>
              </div>
            )}
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {payment?.dueDate && <p>Vencimento: {payment.dueDate}</p>}
              </div>
              <div className="flex gap-2">
                {payment?.bankSlipUrl && (
                  <Button onClick={() => window.open(payment.bankSlipUrl, '_blank')}>Abrir Boleto</Button>
                )}
                <Button variant="secondary" onClick={() => router.push('/conta/investimentos')}>Ir para Meus Investimentos</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* CARTÃO */}
      {payment?.billingType === 'CREDIT_CARD' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Pagamento com Cartão
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm">
              Status: <span className="font-medium">{payment?.status || (payment?.authorized ? 'CONFIRMED' : 'PENDING')}</span>
            </p>
            {payment?.last4 && (
              <p className="text-sm text-muted-foreground">Cartão **** **** **** {payment.last4}</p>
            )}
            {payment?.id && (
              <p className="text-xs text-muted-foreground">ID do pagamento: {payment.id}</p>
            )}
            <div className="flex justify-end">
              <Button variant="secondary" onClick={() => router.push('/conta/investimentos')}>Ir para Meus Investimentos</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}