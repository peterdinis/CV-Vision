'use server';

import { actionClient } from '@/lib/safe-action';
import { openai } from '@/lib/openai';
import { cvSchema } from '@/schemas/cvSchema';
import { extractTextFromPDF } from '@/utils/pdfHelperFunctions';

export const analyzeAndUploadCVAction = actionClient
    .inputSchema(cvSchema)
    .action(async ({ parsedInput }) => {
        try {
            const buffer = Buffer.from(await parsedInput.file.arrayBuffer());
            const text = await extractTextFromPDF(buffer);

            if (!text || text.length < 100) {
                throw new Error(
                    'CV content is too short or could not be parsed.'
                );
            }

            const completion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: `You are a professional CV/resume analyst and career consultant with 10+ years of experience in recruitment and HR. Your task is to provide detailed, actionable feedback on CVs.

                        RESPONSE FORMAT - Follow this EXACT structure:

                        ## 🔴 CRITICAL ERRORS (Immediate Fix Required)
                        - [Critical error 1 with explanation]
                        - [Critical error 2 with explanation]
                        - [Critical error 3 with explanation]
                        (Maximum 5 critical errors)

                        ## 🟡 MAJOR ISSUES (Significantly Reduce Chances)
                        - [Major issue 1 with specific examples]
                        - [Major issue 2 with specific examples]
                        - [Major issue 3 with specific examples]

                        ## 🟢 AREAS FOR IMPROVEMENT
                        - [Specific improvement area 1 with suggestions]
                        - [Specific improvement area 2 with suggestions]
                        - [Specific improvement area 3 with suggestions]

                        ## 📝 CONTENT & STRUCTURE ANALYSIS
                        ### Strengths:
                        - [Strength 1]
                        - [Strength 2]
                        
                        ### Weaknesses:
                        - [Weakness 1 with line references if possible]
                        - [Weakness 2 with line references if possible]

                        ## 💡 ACTIONABLE RECOMMENDATIONS
                        ### Priority 1 (Do this now):
                        1. [Most important fix]
                        2. [Second most important fix]

                        ### Priority 2 (Do within 24 hours):
                        1. [Important enhancement]
                        2. [Important enhancement]

                        ### Priority 3 (Consider for next version):
                        1. [Long-term improvement]
                        2. [Long-term improvement]

                        ## ✨ BEFORE & AFTER EXAMPLES
                        ### Weak Phrases Found:
                        - "Responsible for..." → "Increased X by Y% through..."
                        - "Worked on..." → "Led initiative that resulted in..."
                        
                        ### Suggested Replacements:
                        - BEFORE: [Actual phrase from CV]
                        - AFTER: [Improved version with metrics]

                        ## 📊 ATS OPTIMIZATION CHECK
                        - [ATS issue 1]
                        - [ATS issue 2]
                        - [Keyword suggestions for this industry/role]

                        RULES FOR ANALYSIS:
                        1. Be specific - point to exact sections when possible
                        2. Provide concrete examples from the CV
                        3. Suggest solutions, not just criticism
                        4. Focus on action verbs and quantifiable achievements
                        5. Consider the seniority level and industry
                        6. Follow ATS (Applicant Tracking System) best practices
                        7. Be constructive and professional
                        8. Use bullet points for clarity
                        9. If you can't find certain information, note what's missing
                        10. Check for consistency in dates, formatting, and tense
                        
                        Respond in English.`
                    },
                    {
                        role: 'user',
                        content: `Please analyze this CV thoroughly and identify all errors, issues, and improvement opportunities:

                        CV TEXT:
                        ${text}

                        Please analyze for:
                        1. Grammar, spelling, and punctuation errors
                        2. Structural and formatting problems
                        3. Missing key information
                        4. Vague or weak language
                        5. Lack of quantifiable achievements
                        6. Inconsistencies in dates, tense, or formatting
                        7. ATS optimization issues
                        8. Relevance to typical target roles in this field
                        9. Professional tone and presentation
                        10. Clarity and conciseness

                        Respond using the exact format provided above.`
                    },
                ],
                max_tokens: 2000, // Increased for detailed analysis
                temperature: 0.3, // Lower temperature for consistent analysis
                top_p: 0.9,
            });

            const analysis =
                completion.choices?.[0]?.message?.content ||
                'Failed to analyze the CV.';

            return { analysis };
        } catch (err: unknown) {
            console.error('[CV Action] Failed to analyze resume:', err);
            if (err instanceof Error) {
                throw new Error(err.message);
            }
            throw new Error('Unexpected error while analyzing your CV.');
        }
    });