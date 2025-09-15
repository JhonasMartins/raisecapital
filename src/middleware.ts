import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';

// Rotas que requerem autenticação
const protectedRoutes = ['/conta', '/empresa'];

// Rotas de autenticação (usuários logados não devem acessar)
const authRoutes = [
  '/auth/login',
  '/auth/criar-conta',
  '/auth/criar-conta/empresa',
  '/auth/esqueci-senha',
  '/auth/redefinir-senha'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Verificar se é uma rota protegida ou de auth
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  if (!isProtectedRoute && !isAuthRoute) {
    return NextResponse.next();
  }

  // Verificar sessão
  const sessionCookie = request.cookies.get('session')?.value;
  let session = null;
  
  if (sessionCookie) {
    session = await verifySession(sessionCookie);
  }

  // Se é rota protegida e não há sessão válida
  if (isProtectedRoute && !session) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Se é rota de auth e há sessão válida, redirecionar baseado no tipo de usuário
  if (isAuthRoute && session) {
    if (session.userType === 'empresa') {
      return NextResponse.redirect(new URL('/empresa', request.url));
    } else {
      return NextResponse.redirect(new URL('/conta', request.url));
    }
  }

  // Verificar se usuário empresa está tentando acessar /conta
  if (pathname.startsWith('/conta') && session?.userType === 'empresa') {
    return NextResponse.redirect(new URL('/empresa', request.url));
  }

  // Verificar se usuário investidor está tentando acessar /empresa
  if (pathname.startsWith('/empresa') && session?.userType !== 'empresa') {
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
};