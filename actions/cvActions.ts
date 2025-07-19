'use server';

import { z } from 'zod';
import { actionClient } from '@/lib/safe-action';
import { openai } from '@/lib/openai';
import pdfjsLib from 'pdfjs-dist';

export const uploadCVAction = actionClient
    .inputSchema(z.object({}))
    .action(async () => {
        const formData = new FormData();
        const file = formData!.get('resume') as File | null;
        if (!file) {
            throw new Error('No file provided');
        }

        if (file.size > 5 * 1024 * 1024) {
            throw new Error('File too large (max 5MB)');
        }

        if (
            ![
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            ].includes(file.type)
        ) {
            throw new Error('Unsupported file type');
        }

        return {
            name: file.name,
            type: file.type,
            size: file.size,
        };
    });

export const analyzeCVAction = actionClient
    .inputSchema(
        z.object({
            content: z.string().min(1, 'CV content is required'),
        })
    )
    .action(async ({ parsedInput }) => {
        try {
            const completion = await openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content:
                            'You are a helpful assistant that analyzes resumes and gives improvement suggestions.',
                    },
                    {
                        role: 'user',
                        content: `Please analyze the following resume text and provide feedback, pros, cons, and tips:\n\n${parsedInput}`,
                    },
                ],
                temperature: 0.7,
            });

            const analysis =
                completion.choices[0]?.message?.content ||
                'No analysis returned.';

            return { analysis };
        } catch (error) {
            throw new Error(
                'Failed to analyze CV: ' +
                (error instanceof Error ? error.message : String(error))
            );
        }
    });

export const extractTextAction = actionClient
    .inputSchema(z.object({ file: z.instanceof(File) }))
    .action(async ({ parsedInput }) => {
        const loadingTask = pdfjsLib.getDocument({
            data: parsedInput as unknown as ArrayBuffer
        });

        const pdf = await loadingTask.promise;

        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();

            const pageText = textContent.items
                .map((item: any) => item.str)
                .join(' ');

            fullText += pageText + '\n';
        }

        return fullText;
    });
