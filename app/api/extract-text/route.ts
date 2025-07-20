import { NextRequest, NextResponse } from 'next/server';
import PDFParser from 'pdf2json';

function parsePDF(buffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser();

        pdfParser.on('pdfParser_dataError', (err) => {
            reject(err.parserError);
        });

        pdfParser.on('pdfParser_dataReady', (pdfData) => {
            let extractedText = '';

            const pages =
                (pdfData as any)?.Pages || (pdfData as any)?.formImage?.Pages;

            if (!Array.isArray(pages)) {
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
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        if (file.type !== 'application/pdf') {
            return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        const text = await parsePDF(buffer);

        if (!text || text.length < 50) {
            return NextResponse.json(
                { error: 'PDF content is too short or empty' },
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

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
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
