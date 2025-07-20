import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file || file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'Invalid file' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const rawText = buffer.toString('latin1');
  
  const matches = [...rawText.matchAll(/\(([^)]+)\)/g)];
  const extractedText = matches.map((m) => m[1]).join(' ');

  return NextResponse.json({ text: extractedText });
}
