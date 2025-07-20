'use server';

import { z } from 'zod';
import { actionClient } from '@/lib/safe-action';
import { openai } from '@/lib/openai';
import { extractTextFromPDF } from './utils/pdfHelperFunctions';

const cvSchema = z.object({
  file: z.custom<File>((val) => val instanceof File, 'Expected a File'),
});

export const analyzeAndUploadCVAction = actionClient
  .inputSchema(cvSchema)
  .action(async ({ parsedInput }) => {
    try {
      const buffer = Buffer.from(await parsedInput.file.arrayBuffer());
      const text = await extractTextFromPDF(buffer);

      if (!text || text.length < 100) {
        throw new Error('Resume content is too short or could not be parsed.');
      }

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant that provides ONLY clear, actionable tips and suggestions to improve a resume. ' +
              'Do NOT include the resume content or a summary, only the improvement points. ' +
              'Focus on content quality, clarity, structure, formatting, and relevance. Be constructive and concise.',
          },
          {
            role: 'user',
            content: `Here is a resume text:\n\n${text}\n\nPlease provide ONLY a list of specific suggestions to improve this resume.`,
          },
        ],
        max_tokens: 600,
      });

      const analysis = completion.choices?.[0]?.message?.content || 'No suggestions returned.';

      return { analysis };
    } catch (error: any) {
      console.error('[CV Action] Failed to analyze resume:', error);
      throw new Error(error?.message || 'Unexpected error while analyzing your resume.');
    }
  });
