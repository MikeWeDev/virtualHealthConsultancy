import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.ACCESS_SECRET || process.env.SECRET_KEY || 'access_secret_dev';

const PROTECTED_PATHS = ['/doctorProfile', '/connect', '/patient', '/api'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public assets and API auth endpoints
  if (pathname.startsWith('/api/login') || pathname.startsWith('/api/register') || pathname.startsWith('/api/refresh') || pathname.startsWith('/api/logout') ) {
    return NextResponse.next();
  }

  // If path is protected, ensure there's a valid token cookie
  const matchesProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  if (!matchesProtected) return NextResponse.next();

  const token = req.cookies.get('token')?.value;
  if (!token) {
    const loginUrl = new URL('/', req.url);
    loginUrl.pathname = '/';
    return NextResponse.redirect(loginUrl);
  }

  try {
    jwt.verify(token, ACCESS_SECRET);
    return NextResponse.next();
  } catch (err) {
    // Try to refresh: redirect to client where `/api/refresh` can be called, or send to login
    const loginUrl = new URL('/', req.url);
    loginUrl.pathname = '/';
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ['/doctorProfile/:path*', '/connect/:path*', '/patient/:path*', '/api/:path*'],
};
