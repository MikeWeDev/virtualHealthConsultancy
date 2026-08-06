import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import User from '../../../lib/models/User';

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get('refreshToken')?.value;

  try {
    if (refreshToken) {
      await dbConnect();
      // find the user with this refresh token and remove it
      const user = await User.findOne({ refreshToken });
      if (user) {
        user.refreshToken = undefined;
        await user.save();
      }
    }
  } catch (err) {
    console.error('Logout: failed to clear refresh token', err);
  }

  const res = NextResponse.json({ message: 'Logged out' });

  res.cookies.set('token', '', { httpOnly: true, path: '/', maxAge: 0 });
  res.cookies.set('refreshToken', '', { httpOnly: true, path: '/', maxAge: 0 });
  res.cookies.set('user', '', { httpOnly: false, path: '/', maxAge: 0 });

  return res;
}
