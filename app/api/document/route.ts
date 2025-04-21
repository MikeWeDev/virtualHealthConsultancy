// app/api/documents/route.ts
import { NextResponse } from 'next/server';

let documents: any[] = [];

export async function GET() {
  return NextResponse.json({ success: true, data: documents });
}

export async function POST(req: Request) {
  const body = await req.json();

  const newDoc = {
    id: Math.random().toString(36).substring(2, 10),
    userId: body.userId,
    fileName: body.fileName,
    fileUrl: body.fileUrl, // In real case, generate this after uploading to S3 or similar
    uploadedAt: new Date().toISOString(),
  };

  documents.push(newDoc);

  return NextResponse.json({ success: true, data: newDoc }, { status: 201 });
}
