'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function TermosPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string
  
  const [perfilInvestidor, setPerfilInvestidor] = useState<string>('')
  const [investimentosOutrasPlataformas, setInvestimentosOutrasPlataformas] = useState<string>('')
  const [aceitouTermos, setAceitouTermos] = useState<boolean>(false)
  const [errors, setErrors] = useState<string[]>([])

  const handleNext = () => {
    const newErrors: string[] = []
    
    if (!perfilInvestidor) {
      newErrors.push('Selecione seu perfil de investidor')
    }
    
    if (!investimentosOutrasPlataformas) {
      newErrors.push('Informe o valor de investimentos em outras plataformas')
    }
    
    if (!aceitouTermos) {
      newErrors.push('Você deve aceitar os termos de ciência de risco')
    }
    
    if (newErrors.length > 0) {
      setErrors(newErrors)
      return
    }
    
    setErrors([])
    
    // Salvar dados no localStorage
    const termosData = {
      perfilInvestidor,
      investimentosOutrasPlataformas: parseFloat(investimentosOutrasPlataformas.replace(/[^\d,]/g, '').replace(',', '.')),
      aceitouTermos
    }
    
    localStorage.setItem('investmentTermsData', JSON.stringify(termosData))
    
    router.push(`/investir/${slug}/confirmacao`)
  }

  const handlePrevious = () => {
    router.push(`/investir/${slug}/dados`)
  }

  const formatCurrency = (value: string) => {
    // Remove tudo que não é dígito
    const numericValue = value.replace(/\D/g, '')
    
    // Converte para número e formata
    const number = parseFloat(numericValue) / 100
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(number)
  }

  const handleInvestmentChange = (value: string) => {
    const formatted = formatCurrency(value)
    setInvestimentosOutrasPlataformas(formatted)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Termos e Declarações</h1>
        <p className="text-muted-foreground mt-2">
          Complete as informações necessárias para prosseguir com seu investimento
        </p>
      </div>

      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        {/* Auto-declaração de perfil do investidor */}
        <Card>
          <CardHeader>
            <CardTitle>Auto-declaração de Perfil do Investidor *</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <input
                  type="radio"
                  id="perfil1"
                  name="perfilInvestidor"
                  value="superior_1_milhao"
                  checked={perfilInvestidor === 'superior_1_milhao'}
                  onChange={(e) => setPerfilInvestidor(e.target.value)}
                  className="mt-1"
                />
                <Label htmlFor="perfil1" className="text-sm leading-relaxed cursor-pointer">
                  Possuo investimentos financeiros em valor superior a R$ 1 milhão
                </Label>
              </div>
              
              <div className="flex items-start space-x-3">
                <input
                  type="radio"
                  id="perfil2"
                  name="perfilInvestidor"
                  value="superior_200_mil"
                  checked={perfilInvestidor === 'superior_200_mil'}
                  onChange={(e) => setPerfilInvestidor(e.target.value)}
                  className="mt-1"
                />
                <Label htmlFor="perfil2" className="text-sm leading-relaxed cursor-pointer">
                  Possuo investimentos financeiros ou renda bruta anual em valor superior a R$ 200 mil
                </Label>
              </div>
              
              <div className="flex items-start space-x-3">
                <input
                  type="radio"
                  id="perfil3"
                  name="perfilInvestidor"
                  value="inferior_200_mil"
                  checked={perfilInvestidor === 'inferior_200_mil'}
                  onChange={(e) => setPerfilInvestidor(e.target.value)}
                  className="mt-1"
                />
                <Label htmlFor="perfil3" className="text-sm leading-relaxed cursor-pointer">
                  Não possuo investimentos financeiros ou renda bruta anual em valor superior a R$ 200 mil
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Investimentos em outras plataformas */}
        <Card>
          <CardHeader>
            <CardTitle>Investimentos no Ano Calendário</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="investimentosOutrasPlataformas">
                Outras plataformas de crowdfunding (R$) *
              </Label>
              <Input
                id="investimentosOutrasPlataformas"
                value={investimentosOutrasPlataformas}
                onChange={(e) => handleInvestmentChange(e.target.value)}
                placeholder="R$ 0,00"
                required
              />
              <p className="text-sm text-muted-foreground mt-1">
                Informe o valor total investido em outras plataformas de crowdfunding no ano atual
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Termo de ciência de risco */}
        <Card>
          <CardHeader>
            <CardTitle>Termo de Ciência de Risco</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg text-sm">
                <h4 className="font-semibold mb-2">TERMO DE CIÊNCIA DE RISCO</h4>
                <p className="mb-2">
                  O investidor declara estar ciente de que:
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>O investimento em equity crowdfunding apresenta riscos de perda parcial ou total do capital investido;</li>
                  <li>A rentabilidade de investimentos passados não representa garantia de rentabilidade futura;</li>
                  <li>As informações apresentadas não constituem recomendação de investimento;</li>
                  <li>O investidor deve considerar seus objetivos de investimento, situação financeira e tolerância ao risco;</li>
                  <li>É recomendável a diversificação da carteira de investimentos;</li>
                  <li>O investimento em startups e empresas em estágio inicial apresenta alto risco;</li>
                  <li>Não há garantia de liquidez do investimento;</li>
                  <li>O prazo de retorno do investimento pode ser longo e incerto.</li>
                </ul>
              </div>
              
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="aceitouTermos"
                  checked={aceitouTermos}
                  onCheckedChange={(checked) => setAceitouTermos(checked as boolean)}
                />
                <Label htmlFor="aceitouTermos" className="text-sm leading-relaxed cursor-pointer">
                  Li e estou de acordo com o Termo de Ciência de Risco *
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={handlePrevious}>
          Anterior
        </Button>
        <Button onClick={handleNext}>
          Próximo
        </Button>
      </div>
    </div>
  )
}