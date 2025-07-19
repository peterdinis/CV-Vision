'use server';

import { z } from 'zod';
import { actionClient } from '@/lib/safe-action';

export const uploadCVAction = actionClient
.inputSchema(z.object({}))
.action(async ({parsedInput}) => {
    const formData = new FormData();
    const file = formData!.get('resume') as File | null;
    if (!file) {
      throw new Error('No file provided');
    }

    if (file.size > 5 * 1024 * 1024) { 
      throw new Error('File too large (max 5MB)');
    }
    
    if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
      throw new Error('Unsupported file type');
    }

    return {
      name: file.name,
      type: file.type,
      size: file.size,
    };
})