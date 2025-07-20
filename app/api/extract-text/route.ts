import { NextRequest, NextResponse } from 'next/server';
import PDFParser from 'pdf2json';

function parsePDF(buffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser();

        pdfParser.on('pdfParser_dataError', (err) => {
            console.log('[parsePDF] Data error:', err.parserError);
            reject(err.parserError);
        });

        pdfParser.on('pdfParser_dataReady', (pdfData) => {
            let extractedText = '';

            console.log('[parsePDF] PDF data received.');

            const pages =
                (pdfData as any)?.Pages || (pdfData as any)?.formImage?.Pages;

            if (!Array.isArray(pages)) {
                console.log('[parsePDF] No pages found in PDF data.');
                return reject('No pages found in PDF data');
            }

            for (const page of pages) {
                for (const textItem of page.Texts) {
                    for (const subItem of textItem.R) {
                        extractedText += decodeURIComponent(subItem.T) + ' ';
                    }
                    extractedText += '\n';
                }
            }

            console.log('[parsePDF] Extracted text length:', extractedText.length);

            resolve(extractedText.trim());
        });

        pdfParser.parseBuffer(buffer);
    });
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            console.log('[POST] No file received in form data.');
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        console.log('[POST] Received file:', file.name, 'type:', file.type);

        if (file.type !== 'application/pdf') {
            console.log('[POST] Invalid file type:', file.type);
            return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        console.log('[POST] File buffer size:', buffer.length);

        const text = await parsePDF(buffer);

        console.log('[POST] Extracted text length:', text.length);

        if (!text || text.length < 50) {
            console.log('[POST] Extracted text too short or empty.');
            return NextResponse.json(
                { error: 'PDF content is too short or empty' },
                { status: 400 }
            );
        }

        const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

        if (!OPENAI_API_KEY) {
            console.log('[POST] OpenAI API key not configured.');
            return NextResponse.json(
                { error: 'OpenAI API key not configured.' },
                { status: 500 }
            );
        }

        console.log('[POST] Sending request to OpenAI API...');

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content:
                            'You are a helpful assistant that analyzes resumes and summarizes key information like name, contact, education, experience, and skills.',
                    },
                    {
                        role: 'user',
                        content: `Here is a resume:\n\n${text}\n\nPlease provide a structured summary.`,
                    },
                ],
                max_tokens: 500,
            }),
        });

        if (!response.ok) {
            const err = await response.text();
            console.error('[POST] OpenAI API error:', err);
            return NextResponse.json(
                { error: 'OpenAI API request failed' },
                { status: 500 }
            );
        }

        const data = await response.json();
        console.log('[POST] OpenAI API response received:', data);

        const summary = data.choices?.[0]?.message?.content || 'No summary available';

        return NextResponse.json({
            extractedText: text,
            summary,
        });
    } catch (err) {
        console.error('[POST] Unexpected error:', err);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
