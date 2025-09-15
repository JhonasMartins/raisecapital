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

  // Verificar se é rota protegida (evita que '/dashboardx' case com '/dashboard')
  const isProtectedRoute = protectedRoutes.some((route) =>
    path === route || path.startsWith(`${route}/`)
  )

  // Verificar se é rota pública, tratando '/' como match exato
  const isPublicRoute = publicRoutes.some((route) => {
    if (route === '/') return path === '/'
    return path === route || path.startsWith(`${route}/`)
  })

  // Se for rota protegida, SEMPRE exigir autenticação, independentemente de estar na lista pública
  if (isProtectedRoute) {
    const sessionToken = req.cookies.get('session')?.value
    if (!sessionToken) {
      const loginUrl = new URL('/auth/login', req.url)
      loginUrl.searchParams.set('redirect', path)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  // Se é uma rota pública, permitir acesso sem verificação
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Se não é protegida nem explicitamente pública, permitir acesso
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
    '/((?!api|_next/static|_next/image|.*\..*).*)',
  ],
}