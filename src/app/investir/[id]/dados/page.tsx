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
      const response = await fetch(`/api/offers/${offerId}`)
      if (response.ok) {
        const offerData = await response.json()
        setOffer(offerData)
      }
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
  
  const [userData, setUserData] = useState<UserData>({
    // Mock de dados pré-preenchidos
    nome: 'João',
    sobrenome: 'Silva',
    dataNascimento: '1990-05-15',
    nacionalidade: 'Brasileira',
    genero: 'Masculino',
    cpf: '123.456.789-00',
    rg: '12.345.678-9',
    orgaoExp: 'SSP/SP',
    estadoCivil: 'Solteiro',
    empresa: 'Tech Solutions Ltda',
    profissao: 'Desenvolvedor',
    cargo: 'Senior',
    pessoaPoliticamenteExposta: false,
    
    email: 'joao.silva@email.com',
    telefone: '(11) 99999-9999',
    
    pais: 'Brasil',
    cep: '01234-567',
    endereco: 'Rua das Flores',
    numero: '123',
    complemento: 'Apto 45',
    bairro: 'Centro',
    cidade: 'São Paulo',
    estado: 'SP',
    
    banco: 'Banco do Brasil',
    agencia: '1234',
    conta: '567890',
    digitoConta: '1',
    pixTipo: 'CPF',
    pixChave: '123.456.789-00'
  })

  const handleInputChange = (field: keyof UserData, value: string | boolean) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNext = () => {
    // Verificar se o usuário está autenticado
    if (isAuthenticated === false) {
      alert('Você precisa estar logado para continuar com o investimento.')
      return
    }

    // Verificar se a oferta está encerrada
    if (offer && (offer.status === 'encerrada' || offer.status === 'finalizada')) {
      alert('Esta oferta já foi encerrada e não aceita mais investimentos.')
      return
    }

    // Validação básica dos campos obrigatórios
    const requiredFields = [
      'nome', 'sobrenome', 'dataNascimento', 'nacionalidade', 'genero', 'cpf', 'rg', 
      'orgaoExp', 'estadoCivil', 'empresa', 'profissao', 'cargo', 'email', 'telefone',
      'pais', 'cep', 'endereco', 'numero', 'bairro', 'cidade', 'estado',
      'banco', 'agencia', 'conta', 'digitoConta'
    ]
    
    const missingFields = requiredFields.filter(field => !userData[field as keyof UserData])
    
    if (missingFields.length > 0) {
      alert('Por favor, preencha todos os campos obrigatórios.')
      return
    }
    
    // Salvar dados no localStorage
    localStorage.setItem('investmentData', JSON.stringify(userData))
    
    router.push(`/investir/${offerId}/termos`)
  }

  const handlePrevious = () => {
    router.push(`/investir/${offerId}/valor`)
  }

  return (
    <div className="space-y-6">
      {/* Carregamento */}
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

      <div className="space-y-6">
        {/* Dados Pessoais */}
        <Card>
          <CardHeader>
            <CardTitle>Dados Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  value={userData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="sobrenome">Sobrenome *</Label>
                <Input
                  id="sobrenome"
                  value={userData.sobrenome}
                  onChange={(e) => handleInputChange('sobrenome', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
                <Input
                  id="dataNascimento"
                  type="date"
                  value={userData.dataNascimento}
                  onChange={(e) => handleInputChange('dataNascimento', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="nacionalidade">Nacionalidade *</Label>
                <Input
                  id="nacionalidade"
                  value={userData.nacionalidade}
                  onChange={(e) => handleInputChange('nacionalidade', e.target.value)}
                  required
                />
              </div>
              <div>
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
              <div>
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  value={userData.cpf}
                  onChange={(e) => handleInputChange('cpf', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="rg">RG *</Label>
                <Input
                  id="rg"
                  value={userData.rg}
                  onChange={(e) => handleInputChange('rg', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="orgaoExp">Órgão Exp/UF *</Label>
                <Input
                  id="orgaoExp"
                  value={userData.orgaoExp}
                  onChange={(e) => handleInputChange('orgaoExp', e.target.value)}
                  required
                />
              </div>
              <div>
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
              <div>
                <Label htmlFor="empresa">Empresa *</Label>
                <Input
                  id="empresa"
                  value={userData.empresa}
                  onChange={(e) => handleInputChange('empresa', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="profissao">Profissão *</Label>
                <Input
                  id="profissao"
                  value={userData.profissao}
                  onChange={(e) => handleInputChange('profissao', e.target.value)}
                  required
                />
              </div>
              <div>
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
              <div>
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={userData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="telefone">Telefone *</Label>
                <Input
                  id="telefone"
                  value={userData.telefone}
                  onChange={(e) => handleInputChange('telefone', e.target.value)}
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
              <div>
                <Label htmlFor="pais">País *</Label>
                <Input
                  id="pais"
                  value={userData.pais}
                  onChange={(e) => handleInputChange('pais', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cep">CEP *</Label>
                <Input
                  id="cep"
                  value={userData.cep}
                  onChange={(e) => handleInputChange('cep', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endereco">Endereço *</Label>
                <Input
                  id="endereco"
                  value={userData.endereco}
                  onChange={(e) => handleInputChange('endereco', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="numero">Número *</Label>
                <Input
                  id="numero"
                  value={userData.numero}
                  onChange={(e) => handleInputChange('numero', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="complemento">Complemento</Label>
                <Input
                  id="complemento"
                  value={userData.complemento}
                  onChange={(e) => handleInputChange('complemento', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="bairro">Bairro *</Label>
                <Input
                  id="bairro"
                  value={userData.bairro}
                  onChange={(e) => handleInputChange('bairro', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cidade">Cidade *</Label>
                <Input
                  id="cidade"
                  value={userData.cidade}
                  onChange={(e) => handleInputChange('cidade', e.target.value)}
                  required
                />
              </div>
              <div>
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
              <div>
                <Label htmlFor="banco">Banco *</Label>
                <Input
                  id="banco"
                  value={userData.banco}
                  onChange={(e) => handleInputChange('banco', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="agencia">Agência *</Label>
                <Input
                  id="agencia"
                  value={userData.agencia}
                  onChange={(e) => handleInputChange('agencia', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="conta">Conta (sem dígito) *</Label>
                <Input
                  id="conta"
                  value={userData.conta}
                  onChange={(e) => handleInputChange('conta', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="digitoConta">Dígito conta *</Label>
                <Input
                  id="digitoConta"
                  value={userData.digitoConta}
                  onChange={(e) => handleInputChange('digitoConta', e.target.value)}
                  required
                />
              </div>
              <div>
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
              <div>
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
      </div>

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
        </>
      )}
    </div>
  )
}