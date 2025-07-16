import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths that require authentication
const PROTECTED_PATHS = ['/admin'];
const AUTH_PATHS = ['/signin', '/signup'];
const SESSION_COOKIE_NAME = 'session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get session cookie
  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  // Check if path requires authentication
  const isProtectedPath = PROTECTED_PATHS.some(path => pathname.startsWith(path));
  const isAuthPath = AUTH_PATHS.some(path => pathname.startsWith(path));

  try {
    if (!session) {
      // No session - redirect to signin if trying to access protected path
      if (isProtectedPath) {
        const signInUrl = new URL('/signin', request.url);
        signInUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(signInUrl);
      }
      // Allow access to auth paths and public paths
      return NextResponse.next();
    }

    // For protected paths, verify session through API
    if (isProtectedPath) {
      const apiUrl = process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_API_URL
        : 'http://localhost:3001';

      const response = await fetch(`${apiUrl}/auth/verify`, {
        method: 'POST',
        headers: {
          Cookie: `session=${session}`
        }
      });

      if (!response.ok) {
        // Invalid session - redirect to signin
        const response = NextResponse.redirect(new URL('/signin', request.url));
        response.cookies.delete(SESSION_COOKIE_NAME);
        return response;
      }

      // For admin paths, verify admin status
      if (pathname.startsWith('/admin')) {
        const adminResponse = await fetch(`${apiUrl}/admin/test`, {
          headers: {
            Cookie: `session=${session}`
          }
        });

        if (!adminResponse.ok) {
          return NextResponse.redirect(new URL('/', request.url));
        }
      }
    }

    // Redirect to home if accessing auth paths while logged in
    if (isAuthPath && session) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Allow access to protected paths for authenticated users
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    
    // Clear invalid session
    const response = NextResponse.redirect(new URL('/signin', request.url));
    response.cookies.delete(SESSION_COOKIE_NAME);
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}; 