import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { query } from '@/lib/db'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    // Buscar todos os dados do usuário no banco
    const result = await query(
      `SELECT 
        id, email, name, tipo_pessoa,
        data_nascimento, cpf, rg, razao_social, cnpj,
        representante_nome, representante_cpf, representante_cargo,
        cep, endereco_logradouro, endereco_numero, endereco_complemento,
        endereco_bairro, endereco_cidade, endereco_estado, endereco_pais,
        profissao, empresa_trabalho, renda_mensal, patrimonio,
        banco, agencia, conta
      FROM users WHERE id = $1`,
      [user.id]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    const userData = result.rows[0] as any

    // Mapear dados do banco para o formato esperado pelo frontend
    const profileData = {
      // Dados pessoais
      nome: userData.name ? userData.name.split(' ')[0] || '' : '',
      sobrenome: userData.name ? userData.name.split(' ').slice(1).join(' ') || '' : '',
      dataNascimento: userData.data_nascimento ? userData.data_nascimento.toISOString().split('T')[0] : '',
      nacionalidade: 'Brasileira',
      genero: '', // Campo não existe no banco ainda
      cpf: userData.cpf || '',
      rg: userData.rg || '',
      orgaoExp: '', // Campo não existe no banco ainda
      estadoCivil: '', // Campo não existe no banco ainda
      empresa: userData.empresa_trabalho || '',
      profissao: userData.profissao || '',
      cargo: userData.representante_cargo || '',
      pessoaPoliticamenteExposta: false, // Campo não existe no banco ainda
      
      // Contato
      email: userData.email || '',
      telefone: '', // Campo não existe no banco ainda
      
      // Endereço
      pais: userData.endereco_pais || 'Brasil',
      cep: userData.cep || '',
      endereco: userData.endereco_logradouro || '',
      numero: userData.endereco_numero || '',
      complemento: userData.endereco_complemento || '',
      bairro: userData.endereco_bairro || '',
      cidade: userData.endereco_cidade || '',
      estado: userData.endereco_estado || '',
      
      // Dados bancários
      banco: userData.banco || '',
      agencia: userData.agencia || '',
      conta: userData.conta || '',
      digitoConta: '', // Campo não existe no banco ainda
      pixTipo: '', // Campo não existe no banco ainda
      pixChave: '', // Campo não existe no banco ainda

      // Dados adicionais para PJ
      razaoSocial: userData.razao_social || '',
      cnpj: userData.cnpj || '',
      representanteNome: userData.representante_nome || '',
      representanteCpf: userData.representante_cpf || '',
      
      // Metadados
      tipoPessoa: userData.tipo_pessoa || 'pf',
      hasCompleteProfile: false // Será calculado no frontend
    }

    return NextResponse.json({ profile: profileData })
  } catch (error) {
    console.error('Erro ao buscar perfil do usuário:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const body = await req.json()
    
    // Mapear campos do frontend para o banco
    const updates: string[] = []
    const values: any[] = [user.id]
    let idx = 2

    // Nome completo
    if (body.nome || body.sobrenome) {
      const fullName = [body.nome, body.sobrenome].filter(Boolean).join(' ').trim()
      if (fullName) {
        updates.push(`name = $${idx}`)
        values.push(fullName)
        idx++
      }
    }

    // Dados pessoais
    if (body.dataNascimento) {
      updates.push(`data_nascimento = $${idx}`)
      values.push(body.dataNascimento)
      idx++
    }

    if (body.cpf) {
      updates.push(`cpf = $${idx}`)
      values.push(body.cpf.replace(/\D/g, ''))
      idx++
    }

    if (body.rg) {
      updates.push(`rg = $${idx}`)
      values.push(body.rg)
      idx++
    }

    if (body.cnpj) {
      updates.push(`cnpj = $${idx}`)
      values.push(body.cnpj.replace(/\D/g, ''))
      idx++
    }

    if (body.razaoSocial) {
      updates.push(`razao_social = $${idx}`)
      values.push(body.razaoSocial)
      idx++
    }

    if (body.representanteNome) {
      updates.push(`representante_nome = $${idx}`)
      values.push(body.representanteNome)
      idx++
    }

    if (body.representanteCpf) {
      updates.push(`representante_cpf = $${idx}`)
      values.push(body.representanteCpf.replace(/\D/g, ''))
      idx++
    }

    if (body.cargo) {
      updates.push(`representante_cargo = $${idx}`)
      values.push(body.cargo)
      idx++
    }

    // Endereço
    if (body.cep) {
      updates.push(`cep = $${idx}`)
      values.push(body.cep.replace(/\D/g, ''))
      idx++
    }

    if (body.endereco) {
      updates.push(`endereco_logradouro = $${idx}`)
      values.push(body.endereco)
      idx++
    }

    if (body.numero) {
      updates.push(`endereco_numero = $${idx}`)
      values.push(body.numero)
      idx++
    }

    if (body.complemento) {
      updates.push(`endereco_complemento = $${idx}`)
      values.push(body.complemento)
      idx++
    }

    if (body.bairro) {
      updates.push(`endereco_bairro = $${idx}`)
      values.push(body.bairro)
      idx++
    }

    if (body.cidade) {
      updates.push(`endereco_cidade = $${idx}`)
      values.push(body.cidade)
      idx++
    }

    if (body.estado) {
      updates.push(`endereco_estado = $${idx}`)
      values.push(body.estado)
      idx++
    }

    if (body.pais) {
      updates.push(`endereco_pais = $${idx}`)
      values.push(body.pais)
      idx++
    }

    // Dados profissionais
    if (body.profissao) {
      updates.push(`profissao = $${idx}`)
      values.push(body.profissao)
      idx++
    }

    if (body.empresa) {
      updates.push(`empresa_trabalho = $${idx}`)
      values.push(body.empresa)
      idx++
    }

    // Dados bancários
    if (body.banco) {
      updates.push(`banco = $${idx}`)
      values.push(body.banco)
      idx++
    }

    if (body.agencia) {
      updates.push(`agencia = $${idx}`)
      values.push(body.agencia)
      idx++
    }

    if (body.conta) {
      updates.push(`conta = $${idx}`)
      values.push(body.conta)
      idx++
    }

    if (updates.length === 0) {
      return NextResponse.json({ updated: false, message: 'Nenhum campo para atualizar' })
    }

    // Adicionar updated_at
    updates.push(`updated_at = NOW()`)

    const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = $1 RETURNING id`
    await query(sql, values)

    return NextResponse.json({ updated: true, message: 'Perfil atualizado com sucesso' })
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}