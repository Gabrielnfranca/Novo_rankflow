import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  // Atualiza a sessão (renova o cookie se necessário)
  const response = await updateSession(request)
  
  // Se updateSession retornar null ou uma resposta de redirecionamento, retornamos ela
  if (response) {
    // Se for uma resposta normal (NextResponse), continuamos
    // Se for um redirecionamento, o updateSession já cuidou disso? 
    // Na verdade, updateSession retorna NextResponse ou null/void.
    // Vamos simplificar: updateSession deve ser chamado para gerenciar a expiração.
    // Mas a proteção de rotas faremos aqui explicitamente.
  }

  const currentUser = request.cookies.get('session')?.value
  const path = request.nextUrl.pathname

  // Rotas públicas que não precisam de autenticação
  if (path === '/login' || path.startsWith('/api/public')) {
    if (currentUser) {
      // Se já está logado e tenta acessar login, manda pro dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // Rotas protegidas (todas exceto login e estáticos)
  // Vamos proteger especificamente /dashboard e /admin
  if (path.startsWith('/dashboard') || path.startsWith('/admin')) {
    if (!currentUser) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return response || NextResponse.next()
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
}
