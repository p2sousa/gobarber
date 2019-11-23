import request from 'supertest';
import app from '../../../src/app';
import truncate from '../../util/truncate';

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be able to register', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        name: 'usuario',
        email: 'usuario@test.com',
        password: '1234',
      });

    expect(response.body).toHaveProperty('id');
  });
});
