import request from 'supertest';
import app from '../server'; // Your Express app

describe('POST /register', () => {
  it('should register a new user and return user ID', async () => {
    const response = await request(app)
      .post('/register')
      .send({
        name: 'Max',
        email: 'max@example.com',
        password: 'securePassword123',
      });

    expect(response.status).toBe(201);
    expect(response.body.userId).toBeDefined();
  });

  it('should return 400 if the email already exists', async () => {
    await request(app)
      .post('/register')
      .send({
        name: 'Max',
        email: 'max@example.com',
        password: 'securePassword123',
      });

    const response = await request(app)
      .post('/register')
      .send({
        name: 'Max',
        email: 'max@example.com',
        password: 'securePassword123',
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('User with this email already exists');
  });
});