import request from 'supertest';
import app from '../app';
import { measureRequest, printMetrics } from './helpers';
import { authToken } from './1_auth.test';

const metrics = [{ name: 'Users', times: [] }];

describe('Users', () => {
    afterAll(() => {
        printMetrics(metrics);
    });

    it('should get current user profile', async () => {
        const res = await measureRequest(() =>
                request(app)
                    .get('/users/me')
                    .set('Authorization', `Bearer ${authToken}`),
            metrics[0]
        );
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('uid');
    });

    it('should get user profile by UID', async () => {
        const res = await measureRequest(() =>
                request(app)
                    .get('/users/test-user')
                    .set('Authorization', `Bearer ${authToken}`),
            metrics[0]
        );
        expect(res.status).toBe(200);
    });
});
