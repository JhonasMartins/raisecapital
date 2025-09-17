'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Lock } from 'lucide-react'

interface UserData {
  // Dados pessoais
  nome: string
  sobrenome: string
  dataNascimento: string
  nacionalidade: string
  genero: string
  cpf: string
  rg: string
  orgaoExp: string
  estadoCivil: string
  empresa: string
  profissao: string
  cargo: string
  pessoaPoliticamenteExposta: boolean
  
  // Contato
  email: string
  telefone: string
  
  // Endereço
  pais: string
  cep: string
  endereco: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  estado: string
  
  // Dados bancários
  banco: string
  agencia: string
  conta: string
  digitoConta: string
  pixTipo?: string
  pixChave?: string
  
  // Documento para estrangeiros
  docTipo?: string
  docNumero?: string
  docPaisEmissor?: string
  docOrgaoEmissor?: string
}

export default function DadosPage() {
  const router = useRouter()
  const params = useParams()
  const offerId = params.id as string

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [offer, setOffer] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const checkAuthentication = async () => {
    try {
      const response = await fetch('/api/auth/me')
      setIsAuthenticated(response.ok)
    } catch (error) {
      setIsAuthenticated(false)
    }
  }

  const fetchOffer = async () => {
    try {
      const response = await fetch(`/api/ofertas/${offerId}`)
      if (response.ok) {
        const offerData = await response.json()
        setOffer(offerData)
      }
    } catch (error) {
      console.error('Erro ao buscar oferta:', error)
    }
  }

  useEffect(() => {
    Promise.all([checkAuthentication(), fetchOffer(), fetchUserData()]).finally(() => setLoading(false))
  }, [offerId])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const data = await response.json()
        setUserData({ ...(data?.profile ?? data), nacionalidade: 'Brasileira' })
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error)
    } finally {
      setIsLoadingUserData(false)
    }
  }

  // Estado com dados reais do usuário (não mais mockados)
  const [userData, setUserData] = useState<UserData>({
    // Dados pessoais
    nome: '',
    sobrenome: '',
    dataNascimento: '',
    nacionalidade: 'Brasileira',
    genero: '',
    cpf: '',
    rg: '',
    orgaoExp: '',
    estadoCivil: '',
    empresa: '',
    profissao: '',
    cargo: '',
    pessoaPoliticamenteExposta: false,
    
    // Contato
    email: '',
    telefone: '',
    
    // Endereço
    pais: 'Brasil',
    cep: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    
    // Dados bancários
    banco: '',
    agencia: '',
    conta: '',
    digitoConta: '',
    pixTipo: '',
    pixChave: '',

    // Documento para estrangeiros
    docTipo: '',
    docNumero: '',
    docPaisEmissor: '',
    docOrgaoEmissor: '',
  })

  const [isLoadingUserData, setIsLoadingUserData] = useState(true)
const [formError, setFormError] = useState<string>('')
useEffect(() => {
  if (formError) {
    const el = document.getElementById('form-error')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}, [formError])

  // Estados locais para Órgão Exp/UF
  const [orgaoExpTipo, setOrgaoExpTipo] = useState('')
  const [orgaoExpUF, setOrgaoExpUF] = useState('')
  useEffect(() => {
    const s = (userData.orgaoExp || '').toUpperCase().trim()
    if (!s) { setOrgaoExpTipo(''); setOrgaoExpUF(''); return }
    const parts = s.split(/[\s\/\-]+/).filter(Boolean)
    let tipo = parts[0] || ''
    let uf = ''
    if (parts.length >= 2) uf = parts[parts.length - 1]
    if (uf.length !== 2) uf = ''
    setOrgaoExpTipo(tipo)
    setOrgaoExpUF(uf)
  }, [userData.orgaoExp])

  const handleOrgaoExpTipoChange = (value: string) => {
    setOrgaoExpTipo(value)
    const combined = value && orgaoExpUF ? `${value}/${orgaoExpUF}` : value || orgaoExpUF || ''
    handleInputChange('orgaoExp', combined)
  }
  const handleOrgaoExpUFChange = (value: string) => {
    setOrgaoExpUF(value)
    const combined = orgaoExpTipo && value ? `${orgaoExpTipo}/${value}` : orgaoExpTipo || value || ''
    handleInputChange('orgaoExp', combined)
  }

  // Ajustar documentos quando nacionalidade muda
  useEffect(() => {
    const isBR = userData.nacionalidade === 'Brasileira'
    if (isBR) {
      setUserData(prev => ({
        ...prev,
        docTipo: '',
        docNumero: '',
        docPaisEmissor: '',
        docOrgaoEmissor: '',
      }))
    } else {
      setUserData(prev => ({
        ...prev,
        cpf: '',
        rg: '',
        orgaoExp: '',
      }))
      setOrgaoExpTipo('')
      setOrgaoExpUF('')
    }
  }, [userData.nacionalidade])

  // Helpers de formatação
  const onlyDigits = (s: string) => s.replace(/\D/g, '')
  const formatCPF = (value: string) => {
    const v = onlyDigits(value).slice(0, 11)
    const part1 = v.slice(0, 3)
    const part2 = v.slice(3, 6)
    const part3 = v.slice(6, 9)
    const part4 = v.slice(9, 11)
    let out = part1
    if (part2) out += `.${part2}`
    if (part3) out += `.${part3}`
    if (part4) out += `-${part4}`
    return out
  }
  const formatCEP = (value: string) => {
    const v = onlyDigits(value).slice(0, 8)
    const part1 = v.slice(0, 5)
    const part2 = v.slice(5, 8)
    return part2 ? `${part1}-${part2}` : part1
  }
  const formatPhoneBR = (value: string) => {
    const v = onlyDigits(value).slice(0, 11)
    const ddd = v.slice(0, 2)
    const isMobile = v.length > 10
    const mid = isMobile ? v.slice(2, 7) : v.slice(2, 6)
    const end = isMobile ? v.slice(7, 11) : v.slice(6, 10)
    if (!ddd) return ''
    let out = `(${ddd}`
    out += `) `
    out += mid
    if (end) out += `-${end}`
    return out
  }

  // Busca CEP automática (BrasilAPI)
  const [lastCepSearched, setLastCepSearched] = useState('')
  const lookupCep = async (cepDigits: string) => {
    try {
      const res = await fetch(`https://brasilapi.com.br/api/cep/v2/${cepDigits}`)
      if (!res.ok) throw new Error('CEP não encontrado')
      const data = await res.json()
      const street = data.street || data.logradouro || ''
      const neighborhood = data.neighborhood || data.bairro || ''
      const city = data.city || data.localidade || ''
      const state = data.state || data.uf || ''
      setUserData(prev => ({
        ...prev,
        endereco: prev.endereco || street,
        bairro: prev.bairro || neighborhood,
        cidade: prev.cidade || city,
        estado: prev.estado || state,
        pais: prev.pais || 'Brasil',
      }))
    } catch (e) {
      console.error('Erro ao buscar CEP na BrasilAPI:', e)
    }
  }

  const handleInputChange = (field: keyof UserData, value: string | boolean) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Handlers específicos com máscara
  const handleCPFChange = (value: string) => {
    handleInputChange('cpf', formatCPF(value))
  }
  const handleTelefoneChange = (value: string) => {
    handleInputChange('telefone', formatPhoneBR(value))
  }
  const handleCEPChange = (value: string) => {
    const masked = formatCEP(value)
    setUserData(prev => ({ ...prev, cep: masked }))
    const digits = onlyDigits(masked)
    if (digits.length === 8 && digits !== lastCepSearched) {
      setLastCepSearched(digits)
      lookupCep(digits)
    }
  }

  const handleNext = () => {
    // Verificar se o usuário está autenticado
    if (isAuthenticated === false) {
      setFormError('Você precisa estar logado para continuar com o investimento.')
      return
    }

    // Verificar se a oferta está encerrada
    if (offer && (offer.status === 'encerrada' || offer.status === 'finalizada')) {
      setFormError('Esta oferta já foi encerrada e não aceita mais investimentos.')
      return
    }

    // Nacionalidade fixada como Brasileira; não há necessidade de ajustar documentos dinamicamente.

    // Validação rigorosa dos campos obrigatórios
    const baseRequired = [
      'nome', 'sobrenome', 'dataNascimento', 'nacionalidade', 'genero',
      'estadoCivil', 'empresa', 'profissao', 'cargo', 'email', 'telefone',
      'pais', 'cep', 'endereco', 'numero', 'bairro', 'cidade', 'estado',
      'banco', 'agencia', 'conta', 'digitoConta'
    ]
    const docRequired = ['cpf', 'rg', 'orgaoExp']
    const requiredFields = [...baseRequired, ...docRequired]
    
    const missingFields = requiredFields.filter(field => {
      const value = userData[field as keyof UserData]
      return !value || (typeof value === 'string' && value.trim() === '')
    })
    
    if (missingFields.length > 0) {
      const fieldNames = {
        nome: 'Nome',
        sobrenome: 'Sobrenome',
        dataNascimento: 'Data de Nascimento',
        nacionalidade: 'Nacionalidade',
        genero: 'Gênero',
        cpf: 'CPF',
        rg: 'RG',
        orgaoExp: 'Órgão Expedidor',
        estadoCivil: 'Estado Civil',
        empresa: 'Empresa',
        profissao: 'Profissão',
        cargo: 'Cargo',
        email: 'E-mail',
        telefone: 'Telefone',
        pais: 'País',
        cep: 'CEP',
        endereco: 'Endereço',
        numero: 'Número',
        bairro: 'Bairro',
        cidade: 'Cidade',
        estado: 'Estado',
        banco: 'Banco',
        agencia: 'Agência',
        conta: 'Conta',
        digitoConta: 'Dígito da Conta',
        docTipo: 'Tipo de Documento',
        docNumero: 'Número do Documento',
        docPaisEmissor: 'País Emissor do Documento',
      } as const
      const missingFieldNames = missingFields.map(field => fieldNames[field as keyof typeof fieldNames]).join(', ')
      setFormError(`Por favor, preencha todos os campos obrigatórios: ${missingFieldNames}`)
      document.getElementById('form-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      const firstMissingField = document.querySelector(`[id="${missingFields[0]}"]`) as HTMLElement
      if (firstMissingField) {
        firstMissingField.focus()
        firstMissingField.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }

    // Validações específicas de formato
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/
    if (userData.cpf && !cpfRegex.test(userData.cpf)) {
     setFormError('CPF deve estar no formato 000.000.000-00')
     document.getElementById('form-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      document.getElementById('cpf')?.focus()
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (userData.email && !emailRegex.test(userData.email)) {
     setFormError('Por favor, insira um e-mail válido')
     document.getElementById('form-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      document.getElementById('email')?.focus()
      return
    }

    const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/
    if (userData.telefone && !phoneRegex.test(userData.telefone)) {
     setFormError('Telefone deve estar no formato (00) 00000-0000')
     document.getElementById('form-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      document.getElementById('telefone')?.focus()
      return
    }

    const cepRegex = /^\d{5}-\d{3}$/
    if (userData.cep && !cepRegex.test(userData.cep)) {
     setFormError('CEP deve estar no formato 00000-000')
     document.getElementById('form-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      document.getElementById('cep')?.focus()
      return
    }
    
    // Salvar dados atualizados no banco antes de prosseguir
   setFormError('')
    saveUserData()
    
    // Salvar dados no localStorage para as próximas etapas
    localStorage.setItem('investmentData', JSON.stringify(userData))
    
    router.push(`/investir/${offerId}/termos`)
  }

  const saveUserData = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
      
      if (!response.ok) {
        console.error('Erro ao salvar dados do usuário')
      }
    } catch (error) {
      console.error('Erro ao salvar dados do usuário:', error)
    }
  }

  const handlePrevious = () => {
    router.push(`/investir/${offerId}/valor`)
  }

  return (
    <div className="space-y-6">
      {/* Loading inicial */}
      {(loading || isAuthenticated === null) && (
        <div className="text-center py-8">
          <p>Carregando...</p>
        </div>
      )}

      {/* Tela de login para usuários não autenticados */}
      {!loading && isAuthenticated === false && (
        <div className="text-center py-8 space-y-4">
          <Lock className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Login Necessário</h2>
          <p className="text-muted-foreground">
            Você precisa estar logado para continuar com o investimento.
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
      )}

      {/* Alerta para oferta encerrada */}
      {!loading && isAuthenticated && offer && (offer.status === 'encerrada' || offer.status === 'finalizada') && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">
            <strong>Oferta Encerrada:</strong> Esta oferta já foi finalizada e não aceita mais investimentos.
          </AlertDescription>
        </Alert>
      )}

      {/* Conteúdo principal - só mostra se autenticado e oferta ativa */}
      {!loading && isAuthenticated && (!offer || (offer.status !== 'encerrada' && offer.status !== 'finalizada')) && (
        <>
          <div className="text-center">
            <h1 className="text-2xl font-bold">Confirmação de Dados</h1>
            <p className="text-muted-foreground mt-2">
              Verifique se todos os seus dados estão corretos. Caso não estejam, preencha corretamente antes de continuar.
            </p>
          </div>

          <Alert>
            <AlertDescription>
              Verifique se todos os seus dados estão corretos. Caso não estejam, preencha corretamente antes de continuar.
            </AlertDescription>
          </Alert>

         {formError && (
           <Alert className="border-red-200 bg-red-50" id="form-error">
             <AlertDescription className="text-red-800">{formError}</AlertDescription>
           </Alert>
         )}

          {/* Loading state para dados do usuário */}
          {isLoadingUserData && (
            <div className="text-center py-8">
              <p>Carregando seus dados...</p>
            </div>
          )}

          {/* Formulário de dados - só mostra quando não está carregando */}
          {!isLoadingUserData && (
            <div className="space-y-6">
              {/* Dados Pessoais */}
              <Card>
                <CardHeader>
                  <CardTitle>Dados Pessoais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome *</Label>
                      <Input
                        id="nome"
                        value={userData.nome}
                        onChange={(e) => handleInputChange('nome', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sobrenome">Sobrenome *</Label>
                      <Input
                        id="sobrenome"
                        value={userData.sobrenome}
                        onChange={(e) => handleInputChange('sobrenome', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
                      <Input
                        id="dataNascimento"
                        type="date"
                        value={userData.dataNascimento}
                        onChange={(e) => handleInputChange('dataNascimento', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nacionalidade">Nacionalidade *</Label>
                      <Input id="nacionalidade" value="Brasileira" disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="genero">Gênero *</Label>
                      <Select value={userData.genero} onValueChange={(value) => handleInputChange('genero', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Masculino">Masculino</SelectItem>
                          <SelectItem value="Feminino">Feminino</SelectItem>
                          <SelectItem value="Outro">Outro</SelectItem>
                          <SelectItem value="Prefiro não informar">Prefiro não informar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF *</Label>
                      <Input
                        id="cpf"
                        value={userData.cpf}
                        onChange={(e) => handleCPFChange(e.target.value)}
                        placeholder="000.000.000-00"
                        inputMode="numeric"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rg">RG *</Label>
                      <Input
                        id="rg"
                        value={userData.rg}
                        onChange={(e) => handleInputChange('rg', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="orgaoExp">Órgão Exp/UF *</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Select value={orgaoExpTipo} onValueChange={handleOrgaoExpTipoChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Órgão" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SSP">SSP</SelectItem>
                            <SelectItem value="DETRAN">DETRAN</SelectItem>
                            <SelectItem value="DPF">DPF</SelectItem>
                            <SelectItem value="IFP">IFP</SelectItem>
                            <SelectItem value="OAB">OAB</SelectItem>
                            <SelectItem value="CREA">CREA</SelectItem>
                            <SelectItem value="CRM">CRM</SelectItem>
                            <SelectItem value="CRF">CRF</SelectItem>
                            <SelectItem value="CRC">CRC</SelectItem>
                            <SelectItem value="CRO">CRO</SelectItem>
                            <SelectItem value="CRQ">CRQ</SelectItem>
                            <SelectItem value="OUTRO">OUTRO</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={orgaoExpUF} onValueChange={handleOrgaoExpUFChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="UF" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AC">AC</SelectItem>
                            <SelectItem value="AL">AL</SelectItem>
                            <SelectItem value="AP">AP</SelectItem>
                            <SelectItem value="AM">AM</SelectItem>
                            <SelectItem value="BA">BA</SelectItem>
                            <SelectItem value="CE">CE</SelectItem>
                            <SelectItem value="DF">DF</SelectItem>
                            <SelectItem value="ES">ES</SelectItem>
                            <SelectItem value="GO">GO</SelectItem>
                            <SelectItem value="MA">MA</SelectItem>
                            <SelectItem value="MT">MT</SelectItem>
                            <SelectItem value="MS">MS</SelectItem>
                            <SelectItem value="MG">MG</SelectItem>
                            <SelectItem value="PA">PA</SelectItem>
                            <SelectItem value="PB">PB</SelectItem>
                            <SelectItem value="PR">PR</SelectItem>
                            <SelectItem value="PE">PE</SelectItem>
                            <SelectItem value="PI">PI</SelectItem>
                            <SelectItem value="RJ">RJ</SelectItem>
                            <SelectItem value="RN">RN</SelectItem>
                            <SelectItem value="RS">RS</SelectItem>
                            <SelectItem value="RO">RO</SelectItem>
                            <SelectItem value="RR">RR</SelectItem>
                            <SelectItem value="SC">SC</SelectItem>
                            <SelectItem value="SP">SP</SelectItem>
                            <SelectItem value="SE">SE</SelectItem>
                            <SelectItem value="TO">TO</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estadoCivil">Estado Civil *</Label>
                      <Select value={userData.estadoCivil} onValueChange={(value) => handleInputChange('estadoCivil', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Solteiro">Solteiro(a)</SelectItem>
                          <SelectItem value="Casado">Casado(a)</SelectItem>
                          <SelectItem value="Divorciado">Divorciado(a)</SelectItem>
                          <SelectItem value="Viúvo">Viúvo(a)</SelectItem>
                          <SelectItem value="União Estável">União Estável</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="empresa">Empresa *</Label>
                      <Input
                        id="empresa"
                        value={userData.empresa}
                        onChange={(e) => handleInputChange('empresa', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profissao">Profissão *</Label>
                      <Input
                        id="profissao"
                        value={userData.profissao}
                        onChange={(e) => handleInputChange('profissao', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cargo">Cargo *</Label>
                      <Input
                        id="cargo"
                        value={userData.cargo}
                        onChange={(e) => handleInputChange('cargo', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pessoaPoliticamenteExposta"
                      checked={userData.pessoaPoliticamenteExposta}
                      onCheckedChange={(checked) => handleInputChange('pessoaPoliticamenteExposta', checked as boolean)}
                    />
                    <Label htmlFor="pessoaPoliticamenteExposta">
                      Sou uma pessoa politicamente exposta
                    </Label>
                  </div>
                </CardContent>
              </Card>

              {/* Contato */}
              <Card>
                <CardHeader>
                  <CardTitle>Contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={userData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone *</Label>
                      <Input
                        id="telefone"
                        value={userData.telefone}
                        onChange={(e) => handleTelefoneChange(e.target.value)}
                        placeholder="(00) 00000-0000"
                        inputMode="numeric"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Endereço */}
              <Card>
                <CardHeader>
                  <CardTitle>Endereço</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pais">País *</Label>
                      <Input
                        id="pais"
                        value={userData.pais}
                        onChange={(e) => handleInputChange('pais', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cep">CEP *</Label>
                      <Input
                        id="cep"
                        value={userData.cep}
                        onChange={(e) => handleCEPChange(e.target.value)}
                        onBlur={(e) => {
                          const digits = onlyDigits(e.target.value)
                          if (digits.length === 8 && digits !== lastCepSearched) {
                            setLastCepSearched(digits)
                            lookupCep(digits)
                          }
                        }}
                        placeholder="00000-000"
                        inputMode="numeric"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endereco">Endereço *</Label>
                      <Input
                        id="endereco"
                        value={userData.endereco}
                        onChange={(e) => handleInputChange('endereco', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="numero">Número *</Label>
                      <Input
                        id="numero"
                        value={userData.numero}
                        onChange={(e) => handleInputChange('numero', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="complemento">Complemento</Label>
                      <Input
                        id="complemento"
                        value={userData.complemento}
                        onChange={(e) => handleInputChange('complemento', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bairro">Bairro *</Label>
                      <Input
                        id="bairro"
                        value={userData.bairro}
                        onChange={(e) => handleInputChange('bairro', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cidade">Cidade *</Label>
                      <Input
                        id="cidade"
                        value={userData.cidade}
                        onChange={(e) => handleInputChange('cidade', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="estado">Estado *</Label>
                      <Input
                        id="estado"
                        value={userData.estado}
                        onChange={(e) => handleInputChange('estado', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dados Bancários */}
              <Card>
                <CardHeader>
                  <CardTitle>Dados Bancários</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="banco">Banco *</Label>
                      <Input
                        id="banco"
                        value={userData.banco}
                        onChange={(e) => handleInputChange('banco', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agencia">Agência *</Label>
                      <Input
                        id="agencia"
                        value={userData.agencia}
                        onChange={(e) => handleInputChange('agencia', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="conta">Conta (sem dígito) *</Label>
                      <Input
                        id="conta"
                        value={userData.conta}
                        onChange={(e) => handleInputChange('conta', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="digitoConta">Dígito conta *</Label>
                      <Input
                        id="digitoConta"
                        value={userData.digitoConta}
                        onChange={(e) => handleInputChange('digitoConta', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pixTipo">PIX - Tipo (Opcional)</Label>
                      <Select value={userData.pixTipo || ''} onValueChange={(value) => handleInputChange('pixTipo', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CPF">CPF</SelectItem>
                          <SelectItem value="CNPJ">CNPJ</SelectItem>
                          <SelectItem value="Email">Email</SelectItem>
                          <SelectItem value="Telefone">Telefone</SelectItem>
                          <SelectItem value="Chave Aleatória">Chave Aleatória</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pixChave">PIX - Chave (Opcional)</Label>
                      <Input
                        id="pixChave"
                        value={userData.pixChave || ''}
                        onChange={(e) => handleInputChange('pixChave', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={handlePrevious}>
                  Anterior
                </Button>
                <Button 
                  onClick={handleNext}
                  disabled={offer && (offer.status === 'encerrada' || offer.status === 'finalizada')}
                >
                  {offer && (offer.status === 'encerrada' || offer.status === 'finalizada') ? 'Oferta Encerrada' : 'Próximo'}
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}