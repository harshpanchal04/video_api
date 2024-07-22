// tests/video.test.js
const request = require('supertest');
const app = require('../app');
const fs = require('fs');
const path = require('path');

describe('Video API', () => {
  const token = 'your-static-jwt-token';

  it('should upload a video', (done) => {
    request(app)
      .post('/video/upload')
      .set('Authorization', token)
      .attach('file', fs.readFileSync(path.join(__dirname, 'test_video.mp4')), 'test_video.mp4')
      .field('duration', 120) // Example duration
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('message', 'Video uploaded successfully');
        expect(res.body).toHaveProperty('videoId');
        done();
      });
  });

  it('should trim a video', (done) => {
    jest.setTimeout(30000); // Increase timeout to 30 seconds
    request(app)
      .post('/video/trim')
      .set('Authorization', token)
      .send({ videoId: 1, startTime: 0, endTime: 4 })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'Video trimmed successfully');
        expect(res.body).toHaveProperty('path');
        done();
      });
  });

  it('should merge videos', (done) => {
    jest.setTimeout(30000); // Increase timeout to 30 seconds
    request(app)
      .post('/video/merge')
      .set('Authorization', token)
      .send({ videoIds: [1, 1] })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'Videos merged successfully');
        expect(res.body).toHaveProperty('path');
        done();
      });
  });

  it('should download a video', (done) => {
    jest.setTimeout(10000); // Increase timeout to 10 seconds
    request(app)
      .get('/video/download/1')
      .set('Authorization', token)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).toBe(200);
        expect(res.header['content-type']).toMatch(/video/);
        done();
      });
  });
});
