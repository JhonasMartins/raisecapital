import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';

// Rotas que requerem autenticação
const protectedRoutes = ['/investir'];

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

  // Se é rota de auth e há sessão válida, redirecionar para página inicial
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/', request.url));
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