import { z } from 'zod';

export const PostSchema = z.object({
    post_data: z.object({
        text: z.string().min(1).max(5000),
        image_urls: z.array(z.string().url()).optional().default([])
    }),
    field: z.string().min(1).max(100),
    visibility: z.enum(['public', 'private'])
});
