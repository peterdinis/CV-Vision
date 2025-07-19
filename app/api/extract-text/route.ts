import { NextRequest, NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file || file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'Invalid file' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const data = await pdfParse(buffer);

  return NextResponse.json({ text: data.text });
}