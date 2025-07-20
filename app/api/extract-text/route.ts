import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file || file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'Invalid file' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Nepriečiný pokus o získanie textu z PDF (nie je to parsing)
  const rawText = buffer.toString('utf-8');

  const possibleText = rawText
    .split('\n')
    .filter(line => line.trim().length > 0 && /[a-zA-Z]/.test(line))
    .join('\n');

  console.log("Extracted Text:", possibleText);

  if (!possibleText || possibleText.length < 50) {
    return NextResponse.json(
      { error: 'Text extraction failed or file is mostly empty.' },
      { status: 400 }
    );
  }

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OpenAI API key not configured.' },
      { status: 500 }
    );
  }

  try {
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an assistant that analyzes CVs and extracts key information.',
          },
          {
            role: 'user',
            content: `Analyze the following CV text and provide a short summary:\n\n${possibleText}`,
          },
        ],
        max_tokens: 500,
      }),
    });

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json();
      console.error('OpenAI API error:', errorData);
      return NextResponse.json({ error: 'OpenAI API request failed.' }, { status: 500 });
    }

    const openAIData = await openAIResponse.json();

    const summary = openAIData.choices?.[0]?.message?.content || 'No summary generated';

    return NextResponse.json({
      extractedText: possibleText,
      summary,
    });
  } catch (error) {
    console.error('OpenAI request error:', error);
    return NextResponse.json({ error: 'Failed to call OpenAI API' }, { status: 500 });
  }
}
