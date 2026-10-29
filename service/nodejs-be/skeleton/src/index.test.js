const request = require('supertest');
const app = require('./index');

describe('API Endpoints', () => {
    test('GET / returns correct golden path response', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.status).toBe('healthy');
        expect(response.body.docs_url).toBe('/docs');
    });

    test('GET /health returns UP status', async () => {
        const response = await request(app).get('/health');
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ status: 'UP' });
    });
});
