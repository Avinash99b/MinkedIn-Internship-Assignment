import { z } from 'zod';

export const CommentSchema = z.object({
    post_id: z.number().int().positive(),
    comment_text: z.string().min(1).max(1000)
});
