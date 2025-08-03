import request from 'supertest';
import app from '../app';
import { measureRequest, printMetrics } from './helpers';

import { seedTestUser } from './setup';

beforeAll(async () => {
    await seedTestUser();
});


let authToken: string;
const metrics = [{ name: 'Auth', times: [] }];

describe('Authentication', () => {
    afterAll(() => {
        printMetrics(metrics);
    });

    it('should register a new user', async () => {
        const res = await measureRequest(() =>
                request(app)
                    .post('/auth/register')
                    .send({
                        email: `test${Date.now()}@example.com`,
                        password: 'password123',
                        name: 'Test User',
                        desired_field: 'software'
                    }),
            metrics[0]
        );
        expect([200, 201]).toContain(res.status);
        expect(res.body).toHaveProperty('token');
        authToken = res.body.token;
    });

    it('should login an existing user', async () => {
        const res = await measureRequest(() =>
                request(app)
                    .post('/auth/login')
                    .send({
                        email: 'test@example.com',
                        password: 'password123'
                    }),
            metrics[0]
        );
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('token');
    });
});

export { authToken };
