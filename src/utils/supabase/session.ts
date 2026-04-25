import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // This will refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // --- Route Protection Logic ---


  // STANDARD ROUTE PROTECTION (LIVE DB)
  const isAuthRoute = request.nextUrl.pathname === '/login'

  if (isAuthRoute) {
    if (user) {
      // Allow logged-in users to go straight to their dashboard
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      const url = request.nextUrl.clone()
      url.pathname = profile?.role === 'admin' ? '/admin/resumen' : '/proyecto'
      return NextResponse.redirect(url)
    }
    return supabaseResponse
  }

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/proyecto' // Redirect non-admins away
      return NextResponse.redirect(url)
    }
  }

  // Protect specific client project dashboard accesses
  if (request.nextUrl.pathname.startsWith('/proyecto/') && request.nextUrl.pathname !== '/proyecto') {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
