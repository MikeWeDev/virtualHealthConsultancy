import { NextRequest, NextResponse } from 'next/server';
import { verifyRefreshToken, signAccessToken, signRefreshToken } from '../../../lib/auth';
import dbConnect from '../../../lib/db';
import User from '../../../lib/models/User';
import doctorData from '../../doctor/ProductPage';

function normalizeName(value = '') {
  return value
    .toString()
    .trim()
    .replace(/^dr\.??\s*/i, '')
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

function getDoctorIdForName(name: string) {
  const normalized = normalizeName(name);
  const doctor = doctorData.find((item) => normalizeName(item.Name) === normalized);
  return doctor?.id;
}

export async function GET(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get('refreshToken')?.value;
    if (!refreshToken) {
      return NextResponse.json({ error: 'No refresh token' }, { status: 401 });
    }

    const payload: any = verifyRefreshToken(refreshToken);

    await dbConnect();

    // Ensure refresh token exists for the user (not revoked)
    const user = await User.findOne({ name: payload.name, refreshToken: refreshToken });
    if (!user) {
      return NextResponse.json({ error: 'Refresh token revoked or not found' }, { status: 401 });
    }

    // Rotate refresh token: issue a new one and persist
    const newAccess = signAccessToken({ name: payload.name, role: payload.role });
    const newRefresh = signRefreshToken({ name: payload.name, role: payload.role });

    user.refreshToken = newRefresh;
    await user.save();

    const res = NextResponse.json({ message: 'Token refreshed', name: payload.name, role: payload.role });

    res.cookies.set('token', newAccess, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60,
    });

    res.cookies.set('refreshToken', newRefresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    res.cookies.set(
      'user',
      JSON.stringify({ name: payload.name, role: payload.role, doctorId: getDoctorIdForName(payload.name) }),
      {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      }
    );

    return res;
  } catch (err) {
    console.error('Refresh error', err);
    return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
  }
}
