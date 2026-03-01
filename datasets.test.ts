import request from 'supertest';
import app from '../src/server';
import User from '../src/models/User';
import Dataset from '../src/models/Dataset';

describe('Dataset Routes', () => {
  let token: string;
  let userId: string;

  beforeEach(async () => {
    // Create user and get token
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });
    token = res.body.token;
    userId = res.body.user.id;

    // Clean datasets
    await Dataset.deleteMany({});
  });

  describe('GET /api/datasets', () => {
    it('should get user datasets', async () => {
      const res = await request(app)
        .get('/api/datasets')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.datasets)).toBe(true);
    });

    it('should fail without authentication', async () => {
      const res = await request(app).get('/api/datasets');

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/datasets/upload', () => {
    it('should fail without file', async () => {
      const res = await request(app)
        .post('/api/datasets/upload')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Dataset',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/datasets/:id', () => {
    let datasetId: string;

    beforeEach(async () => {
      // Create a dataset
      const dataset = new Dataset({
        userId,
        name: 'Test Dataset',
        type: 'upload',
        columns: ['col1', 'col2'],
        data: [{ col1: 1, col2: 2 }],
        rowCount: 1,
      });
      await dataset.save();
      datasetId = dataset._id.toString();
    });

    it('should delete a dataset', async () => {
      const res = await request(app)
        .delete(`/api/datasets/${datasetId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should fail with non-existent dataset', async () => {
      const res = await request(app)
        .delete('/api/datasets/507f1f77bcf86cd799439011')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });
  });
});
