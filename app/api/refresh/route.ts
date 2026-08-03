import { NextRequest, NextResponse } from 'next/server';
import { verifyRefreshToken, signAccessToken } from '../../../lib/auth';

export async function GET(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get('refreshToken')?.value;
    if (!refreshToken) {
      return NextResponse.json({ error: 'No refresh token' }, { status: 401 });
    }

    const payload: any = verifyRefreshToken(refreshToken);

    const newAccess = signAccessToken({ name: payload.name, role: payload.role });

    const res = NextResponse.json({ message: 'Token refreshed', name: payload.name, role: payload.role });

    res.cookies.set('token', newAccess, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60,
    });

    return res;
  } catch (err) {
    console.error('Refresh error', err);
    return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
  }
}
