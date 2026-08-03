import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../../../lib/models/User'; // Adjust path if needed
import dbConnect from '../../../lib/db';

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

    const token = jwt.sign(
      { name: user.name, role: user.role },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    // Create a response and set cookies: an httpOnly token and a readable user info cookie
    const res = NextResponse.json({
      message: 'Login successful',
      role: user.role,
      name: user.name,
    });

    // httpOnly token cookie (not accessible from JS)
    res.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60, // 1 hour
    });

    // Non-httpOnly user info cookie (safe to read on client for UI routing; contains no secret)
    res.cookies.set('user', encodeURIComponent(JSON.stringify({ name: user.name, role: user.role })), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60,
    });

    return res;
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
