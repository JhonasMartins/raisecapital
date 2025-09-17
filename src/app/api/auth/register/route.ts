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

    // Se for empresa, tentar criar entrada na tabela empresas (não bloquear cadastro em caso de falha)
    if (userType === 'empresa' && nomeEmpresa && document) {
      try {
        await createCompanyEntry(user.id, nomeEmpresa, cpfCnpj);
      } catch (e) {
        console.error('Falha ao criar entrada de empresa durante o registro (prosseguindo):', e);
      }
    }

    // Persistir CPF/CNPJ no banco independentemente da integração com Asaas
    try {
      if (tipoPessoaNormalized === 'pf') {
        await query(
          `UPDATE users SET cpf = COALESCE(cpf, $1) WHERE id = $2`,
          [cpfCnpj, user.id]
        )
      } else {
        await query(
          `UPDATE users SET cnpj = COALESCE(cnpj, $1) WHERE id = $2`,
          [cpfCnpj, user.id]
        )
      }
    } catch (e) {
      console.error('Falha ao persistir CPF/CNPJ (prosseguindo):', e)
    }

    // Best-effort: integrar com Asaas apenas se chave estiver configurada; não bloquear cadastro em caso de falha
    let asaasCustomerId: string | undefined
    if (process.env.ASAAS_API_KEY) {
      try {
        // 1) Tentar localizar por CPF/CNPJ para evitar duplicidade
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

        // 3) Persistir ID do cliente Asaas se obtido
        if (asaasCustomerId) {
          await query(
            `UPDATE users SET asaas_customer_id = $1 WHERE id = $2`,
            [asaasCustomerId, user.id]
          )
        }
      } catch (err) {
        console.warn('Integração com Asaas falhou durante o registro, prosseguindo sem asaas_customer_id:', err)
      }
    } else {
      console.warn('ASAAS_API_KEY não configurada; pulando integração Asaas no registro.')
    }

    // Criar sessão sempre que usuário for criado com sucesso
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

  } catch (error) {
    console.error('Erro no registro:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}