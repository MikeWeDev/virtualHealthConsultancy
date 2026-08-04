import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '../../../lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    console.log('[api/me] token present:', Boolean(token));
    if (!token) {
      console.log('[api/me] no token found, returning 401');
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const payload: any = verifyAccessToken(token);
    console.log('[api/me] verified payload:', payload);

    return NextResponse.json({ name: payload.name, role: payload.role });
  } catch (err) {
    console.error('[api/me] Me route error', err);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
