// app/api/booking/route.ts
import { NextResponse } from 'next/server';

let bookings: any[] = []; // Temporary array (mock database)

// GET all bookings
export async function GET() {
  return NextResponse.json({ success: true, data: bookings });
}

// POST a new booking
export async function POST(req: Request) {
  const body = await req.json();

  // Create new booking object (without ID)
  const newBooking = {
    patientName: body.patientName,
    doctorName: body.doctorName,
    appointmentDate: body.appointmentDate,
    reason: body.reason,
  };

  bookings.push(newBooking);

  return NextResponse.json({ success: true, data: newBooking }, { status: 201 });
}
