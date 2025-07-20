'use server';

import { z } from 'zod';
import { actionClient } from '@/lib/safe-action';
import { openai } from '@/lib/openai';

export const analyzeAndUploadCVAction = actionClient
  .inputSchema(
    z.object({
      file: z.instanceof(File),
    })
  )
  .action(async ({ parsedInput }) => {
    const file = parsedInput.file;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File too large (max 5MB)');
    }

    // Validate file type
    const supportedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!supportedTypes.includes(file.type)) {
      throw new Error('Unsupported file type');
    }

    // Read file content as text
    const text = await file.text();

    if (!text || text.trim().length === 0) {
      throw new Error('Resume file is empty');
    }

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant that analyzes resumes and gives improvement suggestions.',
          },
          {
            role: 'user',
            content: `Please analyze the following resume text and provide feedback, pros, cons, and tips:\n\n${text}`,
          },
        ],
        temperature: 0.7,
      });

      const analysis =
        completion.choices[0]?.message?.content || 'No analysis returned.';

      return { analysis };
    } catch (error) {
      console.error('[analyzeAndUploadCVAction] OpenAI error:', error);
      throw new Error(
        'Failed to analyze resume: ' +
          (error instanceof Error ? error.message : String(error))
      );
    }
  });
