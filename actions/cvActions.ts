'use server';

import { actionClient } from '@/lib/safe-action';
import { openai } from '@/lib/openai';
import { extractTextFromPDF } from './utils/pdfHelperFunctions';
import { cvSchema } from '@/schemas/cvSchema';

export const analyzeAndUploadCVAction = actionClient
    .inputSchema(cvSchema)
    .action(async ({ parsedInput }) => {
        try {
            const buffer = Buffer.from(await parsedInput.file.arrayBuffer());
            const text = await extractTextFromPDF(buffer);

            if (!text || text.length < 100) {
                throw new Error(
                    'Resume content is too short or could not be parsed.'
                );
            }

            const completion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: `You are a helpful assistant that provides ONLY categorized and actionable tips to improve a resume.
                            Your response MUST follow this exact structure (with these headings):
                            - Pros:
                            - Cons:
                            - Tips:
                            Each section should contain a bullet-point list with helpful and constructive suggestions. Do NOT include the resume content, summary, or general feedback outside the categories.
                            Keep the suggestions short, clear, and relevant.
                        `,
                    },
                    {
                        role: 'user',
                        content: `Here is a resume text:\n\n${text}\n\nPlease analyze and return ONLY the categorized suggestions using the labels: Pros, Cons, and Tips.`,
                    },
                ],
                max_tokens: 600,
            });

            const analysis =
                completion.choices?.[0]?.message?.content ||
                'No suggestions returned.';

            return { analysis };
        } catch (err: unknown) {
            console.error('[CV Action] Failed to analyze resume:', err);
            if (err instanceof Error) {
                throw new Error(err.message);
            }
            throw new Error('Unexpected error while analyzing your resume.');
        }
    });
