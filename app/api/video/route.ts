// app/api/video-call/route.ts
import { NextResponse } from 'next/server';

// Temporary in-memory session storage
let sessions: any[] = [];

// GET all active sessions
export async function GET() {
  return NextResponse.json({ success: true, data: sessions });
}

// POST a new video call session
export async function POST(req: Request) {
  const body = await req.json();

  const newSession = {
    id: Math.random().toString(36).substring(2, 9),
    doctorId: body.doctorId,
    patientId: body.patientId,
    startTime: new Date().toISOString(),
    room: `room-${Date.now()}`,
  };

  sessions.push(newSession);

  return NextResponse.json({ success: true, data: newSession }, { status: 201 });
}
