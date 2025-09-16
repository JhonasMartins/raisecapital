import { NextRequest, NextResponse } from 'next/server';
import { createUser, emailExists, isValidEmail, createSession, setSessionCookie, createCompanyEntry } from '@/lib/auth';

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

    // Verificar se email já existe
    if (await emailExists(email.toLowerCase())) {
      return NextResponse.json(
        { error: 'Este email já está em uso' },
        { status: 409 }
      );
    }

    // Normalizar tipo de pessoa conforme constraint da tabela users (pf/pj)
    const tipoPessoaNormalized = userType === 'empresa' ? 'pj' : 'pf';

    // Criar usuário
    const user = await createUser(email.toLowerCase(), password, name.trim(), tipoPessoaNormalized);

    // Se for empresa, criar entrada na tabela empresas
    if (userType === 'empresa' && nomeEmpresa && document) {
      await createCompanyEntry(user.id, nomeEmpresa, document.replace(/\D/g, ''));
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