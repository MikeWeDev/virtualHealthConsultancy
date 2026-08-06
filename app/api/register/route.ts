import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import User from '../../../lib/models/User'; // Adjust if needed
import dbConnect from '../../../lib/db'; // Your custom DB connection

export async function POST(req: NextRequest) {
  try {
    const { name, password } = await req.json();

    if (!name || !password) {
      return NextResponse.json({ error: 'Missing name or password' }, { status: 400 });
    }

    const role = 'patient';

    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
