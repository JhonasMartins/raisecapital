import { NextRequest, NextResponse } from 'next/server'

// Rotas protegidas que requerem autenticação
const protectedRoutes = [
  '/dashboard',
  '/conta',
  '/empresa'
]

// Rotas públicas que não requerem autenticação
const publicRoutes = [
  '/',
  '/auth',
  '/blog',
  '/ofertas',
  '/capte-recursos',
  '/material-didatico',
  '/codigo-de-conduta',
  '/privacidade',
  '/termos',
  '/projetos'
]

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  
  // Verificar se é uma rota protegida
  const isProtectedRoute = protectedRoutes.some(route => 
    path.startsWith(route)
  )
  
  // Verificar se é uma rota pública
  const isPublicRoute = publicRoutes.some(route => 
    path === route || path.startsWith(route)
  )
  
  // Se é uma rota pública, permitir acesso sem verificação
  if (isPublicRoute) {
    return NextResponse.next()
  }
  
  // Se não é uma rota protegida nem pública, permitir acesso
  if (!isProtectedRoute) {
    return NextResponse.next()
  }
  
  // Para rotas protegidas, verificar autenticação usando apenas cookies (Edge-safe)
  const sessionToken = req.cookies.get('better-auth.session-token')?.value
  if (isProtectedRoute && !sessionToken) {
    const loginUrl = new URL('/auth/login', req.url)
    loginUrl.searchParams.set('redirect', path)
    return NextResponse.redirect(loginUrl)
  }

  // Usuário autenticado ou rota não exige mais verificações
  return NextResponse.next()
}

// Configurar quais rotas o middleware deve processar
export const config = {
  matcher: [
    /*
     * Processar todas as rotas exceto:
     * - api (rotas de API)
     * - _next/static (arquivos estáticos)
     * - _next/image (otimização de imagens)
     * - quaisquer arquivos com extensão (ex.: .png, .jpg, .svg, .ico, .xml, .txt etc.)
     */
    '/((?!api|_next/static|_next/image|.*\\..*).*)',
  ],
}