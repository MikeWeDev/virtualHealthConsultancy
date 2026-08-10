import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Let Next.js render page routes like /connect/chat/...
  // The client React components will verify auth state against Render API via apiFetch
  if (pathname.startsWith('/connect')) {
    return NextResponse.next();
  }

  // Check for local session cookie if present
  const token = req.cookies.get('token')?.value;

  // If calling local Next.js API proxy routes without a token
  if (pathname.startsWith('/api') && !token) {
    // Allow public auth endpoints
    if (
      pathname.startsWith('/api/login') ||
      pathname.startsWith('/api/register') ||
      pathname.startsWith('/api/refresh')
    ) {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/connect/:path*', '/api/:path*'],
};