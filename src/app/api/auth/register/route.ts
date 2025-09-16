import { NextRequest, NextResponse } from 'next/server';
import { createUser, emailExists, isValidEmail, createSession, setSessionCookie, createCompanyEntry } from '@/lib/auth';
import { asaas } from '@/lib/asaas'
import { query } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, userType, nomeEmpresa, document } = body;

    // Validação de entrada
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, senha e nome são obrigatórios' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400 }
      );
    }

    // CPF/CNPJ obrigatório para integração com Asaas
    if (!document || typeof document !== 'string' || !document.trim()) {
      return NextResponse.json(
        { error: 'CPF/CNPJ é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se email já existe
    if (await emailExists(email.toLowerCase())) {
      return NextResponse.json(
        { error: 'Este email já está em uso' },
        { status: 409 }
      );
    }

    // Normalizar tipo de pessoa conforme constraint da tabela users (pf/pj)
    const tipoPessoaNormalized = userType === 'empresa' ? 'pj' : 'pf';
    const cpfCnpj = String(document).replace(/\D/g, '');

    // Criar usuário
    const user = await createUser(email.toLowerCase(), password, name.trim(), tipoPessoaNormalized);

    try {
      // Se for empresa, criar entrada na tabela empresas
      if (userType === 'empresa' && nomeEmpresa && document) {
        await createCompanyEntry(user.id, nomeEmpresa, cpfCnpj);
      }

      // Criar/associar cliente no Asaas
      // 1) Tentar localizar por CPF/CNPJ para evitar duplicidade
      let asaasCustomerId: string | undefined
      try {
        const existing = await asaas.getCustomerByCpfCnpj(cpfCnpj)
        if (existing?.data && existing.data.length > 0) {
          asaasCustomerId = existing.data[0]?.id
        }
      } catch (e) {
        // Se a busca falhar, vamos tentar criar abaixo
      }

      // 2) Criar cliente se não encontrado
      if (!asaasCustomerId) {
        const displayName = userType === 'empresa' && nomeEmpresa ? String(nomeEmpresa).trim() : String(name).trim()
        const personType = tipoPessoaNormalized === 'pj' ? 'JURIDICA' : 'FISICA'
        const created = await asaas.createCustomer({
          name: displayName,
          email: email.toLowerCase(),
          cpfCnpj,
          personType,
          notificationEnabled: true,
        })
        asaasCustomerId = created?.id
      }

      if (!asaasCustomerId) {
        throw new Error('Falha ao obter ID do cliente no Asaas')
      }

      // 3) Persistir no banco de dados
      if (tipoPessoaNormalized === 'pf') {
        await query(
          `UPDATE users SET asaas_customer_id = $1, cpf = COALESCE(cpf, $2) WHERE id = $3`,
          [asaasCustomerId, cpfCnpj, user.id]
        )
      } else {
        await query(
          `UPDATE users SET asaas_customer_id = $1, cnpj = COALESCE(cnpj, $2) WHERE id = $3`,
          [asaasCustomerId, cpfCnpj, user.id]
        )
      }

      // Criar sessão
      const sessionToken = await createSession(user);
      await setSessionCookie(sessionToken);

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          userType: user.userType,
          asaasCustomerId,
        },
      });
    } catch (err) {
      // Rollback lógico: remover usuário criado se falhou integração Asaas
      try {
        await query('DELETE FROM users WHERE id = $1', [user.id])
      } catch {}
      console.error('Erro ao integrar com Asaas durante registro:', err)
      return NextResponse.json(
        { error: 'Não foi possível concluir o cadastro por uma falha na integração de pagamentos. Tente novamente em instantes.' },
        { status: 502 }
      );
    }

  } catch (error) {
    console.error('Erro no registro:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}