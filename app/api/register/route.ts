import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import User from '../../../lib/models/User'; // Adjust if needed
import dbConnect from '../../../lib/db'; // Your custom DB connection

export async function POST(req: NextRequest) {
  try {
    const { name, password, role } = await req.json();

    if (!name || !password || !role) {
      return NextResponse.json({ error: 'Missing name, password, or role' }, { status: 400 });
    }

    // Validate role
    if (!['doctor', 'patient'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

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
