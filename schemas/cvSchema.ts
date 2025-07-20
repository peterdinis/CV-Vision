import z from 'zod';

export const cvSchema = z.object({
    file: z.custom<File>((val) => val instanceof File, 'Expected a File'),
});
