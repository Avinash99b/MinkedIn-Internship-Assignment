import request from 'supertest';
import app from '../app';
import { measureRequest, printMetrics } from './helpers';
import { authToken } from './1_auth.test';
import { createdPostId } from './3_posts.test';

const metrics = [{ name: 'Comments', times: [] }];

describe('Comments', () => {
    afterAll(() => {
        printMetrics(metrics);
    });

    it('should add a comment to a post', async () => {
        const res = await measureRequest(() =>
                request(app)
                    .post('/comments')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({
                        post_id: createdPostId,
                        comment_text: 'Nice post!'
                    }),
            metrics[0]
        );
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
    });

    it('should get comments for a post', async () => {
        const res = await measureRequest(() =>
                request(app)
                    .get(`/posts/${createdPostId}/comments`)
                    .set('Authorization', `Bearer ${authToken}`),
            metrics[0]
        );
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});
