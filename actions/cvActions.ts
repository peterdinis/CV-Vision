'use server';

import { z } from 'zod';
import { actionClient } from '@/lib/safe-action';
import { openai } from '@/lib/openai';
import PDFParser from 'pdf2json';

function extractTextFromPDF(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on('pdfParser_dataError', (err) => {
      console.error('[PDF Parser] Error:', err.parserError);
      reject(err.parserError);
    });

    pdfParser.on('pdfParser_dataReady', (pdfData) => {
      let extractedText = '';

      const pages = (pdfData as any)?.Pages;

      if (!Array.isArray(pages)) {
        return reject('No pages found in PDF');
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


const cvSchema = z.object({
  file: z.custom<File>((val) => val instanceof File, 'Expected a File'),
});

export const analyzeAndUploadCVAction = actionClient
  .inputSchema(cvSchema)
  .action(async ({ parsedInput }) => {
    try {
      const buffer = Buffer.from(await parsedInput.file.arrayBuffer());
      const text = await extractTextFromPDF(buffer);

      console.log('[CV Action] Extracted text length:', text.length);

      if (!text || text.length < 100) {
        throw new Error('Resume content is too short or could not be parsed.');
      }

      const limitedText = text.slice(0, 8000);

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant that analyzes resumes and summarizes key information like name, contact info, education, experience, and skills.',
          },
          {
            role: 'user',
            content: `Here is a resume:\n\n${limitedText}\n\nPlease provide a structured summary with suggestions for improvement.`,
          },
        ],
        max_tokens: 500,
      });

      const analysis = completion.choices?.[0]?.message?.content || 'No analysis returned.';
      return { analysis };
    } catch (error: any) {
      console.error('[CV Action] Failed to analyze resume:', error);
      throw new Error(error?.message || 'Unexpected error while analyzing your resume.');
    }
  });