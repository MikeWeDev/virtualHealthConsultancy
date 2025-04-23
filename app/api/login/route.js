import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../../../lib/models/User'; // Adjust path to your actual model file
import dbConnect from '../../../lib/db'; // We'll create this below

const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key';

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, password } = body;

    if (!name || !password) {
      return NextResponse.json({ error: 'Missing name or password' }, { status: 400 });
    }

    await dbConnect(); // Ensure DB is connected

    const user = await User.findOne({ name });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const token = jwt.sign({ name: user.name }, SECRET_KEY, { expiresIn: '1h' });

    return NextResponse.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
