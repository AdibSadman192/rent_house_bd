const request = require('supertest');
const app = require('../app');

// Test suite for authController

describe('AuthController Tests', () => {
  let token;

  beforeAll(async () => {
    // Register a user
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123',
        phone: '+8801234567890',
        nid: '1234567890123',
        address: '123 Test Street',
        role: 'user'
      });

    // Login the user
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123'
      });

    token = response.body.token;
  });

  test('GET /api/auth/me should return current user', async () => {
    const response = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.data.email).toBe('testuser@example.com');
  });

  // Add more tests for other endpoints
});
