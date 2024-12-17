import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const userType = request.cookies.get('userType')?.value;
  
  // Check if the path is a protected route
  const isProtectedRoute = 
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.includes('/(provider)/organization/') ||
    request.nextUrl.pathname.startsWith('/rmf-library');

  // Check if it's an auth page
  const isAuthPage = 
    request.nextUrl.pathname.startsWith('/provider/login') ||
    request.nextUrl.pathname.startsWith('/client/login');

  // If accessing protected route without token, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL(
      userType === 'system' ? '/provider/login' : '/client/login',
      request.url
    );
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If accessing login page with token, redirect to dashboard
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Handle API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Ensure token is forwarded to backend API
    if (token) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('Authorization', `Bearer ${token}`);
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }
  }

  return NextResponse.next();
}

// Configure paths that require middleware
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/provider/login',
    '/client/login',
    '/organization/:path*',
    '/rmf-library/:path*',
    '/api/:path*'
  ],
};
