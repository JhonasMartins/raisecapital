import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

// Rotas protegidas que requerem autenticação
const protectedRoutes = ['/dashboard']

// Rotas públicas que não requerem autenticação
const publicRoutes = ['/auth/login', '/auth/criar-conta', '/', '/ofertas', '/blog', '/capte-recursos', '/empresa']

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
  
  // Se não é uma rota protegida, continuar normalmente
  if (!isProtectedRoute) {
    return NextResponse.next()
  }
  
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
    
    // Verificar se o usuário tem acesso ao dashboard específico
    if (path.startsWith('/dashboard/investidor')) {
      // Para o dashboard do investidor, verificar se o usuário tem o papel correto
      // Por enquanto, permitir acesso a todos os usuários autenticados
      // Futuramente pode ser implementada lógica de roles
    }
    
    if (path.startsWith('/dashboard/empresa')) {
      // Para o dashboard da empresa, verificar se o usuário tem o papel correto
      // Por enquanto, permitir acesso a todos os usuários autenticados
      // Futuramente pode ser implementada lógica de roles
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