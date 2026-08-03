import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const res = NextResponse.json({ message: 'Logged out' });

  res.cookies.set('token', '', { httpOnly: true, path: '/', maxAge: 0 });
  res.cookies.set('refreshToken', '', { httpOnly: true, path: '/api', maxAge: 0 });
  res.cookies.set('user', '', { httpOnly: false, path: '/', maxAge: 0 });

  return res;
}
