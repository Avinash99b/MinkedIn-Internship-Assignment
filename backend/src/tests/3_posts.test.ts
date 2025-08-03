import request from 'supertest';
import app from '../app';
import { measureRequest, printMetrics } from './helpers';
import { authToken } from './1_auth.test';

let createdPostId: number;
const metrics = [{ name: 'Posts', times: [] }];

describe('Posts', () => {
    afterAll(() => {
        printMetrics(metrics);
    });

    it('should create a new post', async () => {
        const res = await measureRequest(() =>
                request(app)
                    .post('/posts')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({
                        post_data: { text: 'Test post', image_urls: [] },
                        field: 'software',
                        visibility: 'public'
                    }),
            metrics[0]
        );
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        createdPostId = res.body.id;
    });

    it('should get public posts', async () => {
        const res = await measureRequest(() =>
                request(app)
                    .get('/posts/public')
                    .set('Authorization', `Bearer ${authToken}`),
            metrics[0]
        );
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('should get a single post by ID', async () => {
        const res = await measureRequest(() =>
                request(app)
                    .get(`/posts/${createdPostId}`)
                    .set('Authorization', `Bearer ${authToken}`),
            metrics[0]
        );
        expect(res.status).toBe(200);
    });
});

export { createdPostId };
