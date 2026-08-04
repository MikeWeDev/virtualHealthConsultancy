import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.ACCESS_SECRET || process.env.SECRET_KEY || 'access_secret_dev';

const PROTECTED_PATHS = ['/connect', '/api'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public assets and API auth endpoints
  if (
    pathname.startsWith('/api/login') ||
    pathname.startsWith('/api/register') ||
    pathname.startsWith('/api/refresh') ||
    pathname.startsWith('/api/logout') ||
    pathname.startsWith('/api/me')
  ) {
    return NextResponse.next();
  }

  // If path is protected, ensure there's a valid token cookie
  const matchesProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  if (!matchesProtected) return NextResponse.next();

  const token = req.cookies.get('token')?.value;
  console.log('[middleware] pathname:', pathname, 'token?', Boolean(token));
  if (!token) {
    console.log('[middleware] no token, redirecting to login');
    const loginUrl = new URL('/', req.url);
    loginUrl.pathname = '/';
    return NextResponse.redirect(loginUrl);
  }

  try {
    jwt.verify(token, ACCESS_SECRET);
    console.log('[middleware] token valid');
    return NextResponse.next();
  } catch (err) {
    console.log('[middleware] token invalid:', err?.message || err);
    const loginUrl = new URL('/', req.url);
    loginUrl.pathname = '/';
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ['/connect/:path*', '/api/:path*'],
};
