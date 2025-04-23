import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../../../lib/models/User'; // Adjust path to your actual model file
import dbConnect from '../../../lib/db'; // Ensure you have a proper database connection utility

const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key';

export async function POST(req: NextRequest) {
  try {
    // Read the request body using req.json()
    const { name, password } = await req.json(); // `req.json()` for parsing body

    if (!name || !password) {
      return NextResponse.json({ error: 'Missing name or password' }, { status: 400 });
    }

    // Connect to the database
    await dbConnect();

    // Find the user in the database
    const user = await User.findOne({ name });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 400 });
    }

    // Compare the password with the hashed password in the DB
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // Generate a JWT token
    const token = jwt.sign({ name: user.name }, SECRET_KEY, { expiresIn: '1h' });

    // Send a successful response with the token
    return NextResponse.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
