import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { signAccessToken, signRefreshToken } from '../../../lib/auth';
import mongoose from 'mongoose';
import User from '../../../lib/models/User'; // Adjust path if needed
import dbConnect from '../../../lib/db';
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

const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key';

export async function POST(req: NextRequest) {
  try {
    const { name, password } = await req.json();

    if (!name || !password) {
      return NextResponse.json({ error: 'Missing name or password' }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findOne({ name });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const accessToken = signAccessToken({ name: user.name, role: user.role });
    const refreshToken = signRefreshToken({ name: user.name, role: user.role });

   // console.log('[api/login] setting token and refreshToken cookies for user', user.name);
    // Create a response and set cookies: an httpOnly token and a readable user info cookie
    const res = NextResponse.json({
      message: 'Login successful',
      role: user.role,
      name: user.name,
    });

    // httpOnly access token cookie (short-lived)
    res.cookies.set('token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60, // 15 minutes
    });

    // httpOnly refresh token cookie (longer-lived)
    res.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    // Persist refresh token for revocation/rotation
    try {
      user.refreshToken = refreshToken;
      await user.save();
    } catch (saveErr) {
      console.error('Failed to save refresh token for user', saveErr);
    }

    // Non-httpOnly user info cookie (safe to read on client for UI routing; contains no secret)
    res.cookies.set(
      'user',
      JSON.stringify({ name: user.name, role: user.role, doctorId: getDoctorIdForName(user.name) }),
      {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      }
    );

    return res;
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
