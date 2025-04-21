// app/api/chat/route.ts
import { NextResponse } from 'next/server';

let messages: any[] = []; // Temporary in-memory chat storage

// GET all messages
export async function GET() {
  return NextResponse.json({ success: true, data: messages });
}

// POST a new message
export async function POST(req: Request) {
  const body = await req.json();

  const newMessage = {
    sender: body.sender,         // doctor or patient
    receiver: body.receiver,     // doctor or patient
    message: body.message,
    timestamp: new Date().toISOString(),
  };

  messages.push(newMessage);

  return NextResponse.json({ success: true, data: newMessage }, { status: 201 });
}
