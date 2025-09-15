import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

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
  
  // Para rotas protegidas, verificar autenticação
  try {
    // Verificar a sessão usando Better Auth
    const session = await auth.api.getSession({
      headers: req.headers
    })
    
    // Se não há sessão válida, redirecionar para login
    if (!session) {
      const loginUrl = new URL('/auth/login', req.url)
      loginUrl.searchParams.set('redirect', path)
      return NextResponse.redirect(loginUrl)
    }
    
    // Se chegou até aqui, o usuário está autenticado e pode acessar
    return NextResponse.next()
    
  } catch (error) {
    console.error('Erro na verificação de autenticação:', error)
    
    // Em caso de erro, redirecionar para login por segurança
    const loginUrl = new URL('/auth/login', req.url)
    loginUrl.searchParams.set('redirect', path)
    return NextResponse.redirect(loginUrl)
  }
}

// Configurar quais rotas o middleware deve processar
export const config = {
  matcher: [
    /*
     * Processar todas as rotas exceto:
     * - api (rotas de API)
     * - _next/static (arquivos estáticos)
     * - _next/image (otimização de imagens)
     * - favicon.ico, sitemap.xml, robots.txt (arquivos de metadados)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}