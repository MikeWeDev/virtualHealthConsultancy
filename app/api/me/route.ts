import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '../../../lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const payload: any = verifyAccessToken(token);

    return NextResponse.json({ name: payload.name, role: payload.role });
  } catch (err) {
    console.error('Me route error', err);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
