import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';

// Rotas que requerem autenticação
const protectedRoutes = ['/conta', '/empresa'];

// Rotas de autenticação (redirecionam se já logado)
const authRoutes = ['/auth/login', '/auth/criar-conta'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Obter token de sessão do cookie
  const sessionToken = request.cookies.get('session')?.value;
  
  // Verificar se o usuário está autenticado
  let isAuthenticated = false;
  if (sessionToken) {
    const session = await verifySession(sessionToken);
    isAuthenticated = !!session;
  }

  // Proteger rotas que requerem autenticação
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirecionar usuários autenticados das páginas de auth
  if (authRoutes.includes(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL('/conta', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
  runtime: 'nodejs',
};