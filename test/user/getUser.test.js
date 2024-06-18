const supertest = require('supertest');
const { app, startServer, closeServer } = require('../../server');
const nock = require('nock');

const apiUrl = 'https://fitcal-api.kevinazemi.com';

describe('getUserByClerkUserId (External API Integration)', () => {
    beforeAll(async () => {
      await startServer(); // Start the server before tests
    });
  
    afterEach(() => {
      nock.cleanAll();
    });
  
    afterAll(async () => {
      await closeServer(); // Close the server after all tests
    });
  
    it('should fetch user data from the external API for a valid clerkUserId', async () => {
      const clerkUserId = 'user_2h4MM1Eqxwsur9rGAN4lTN1dJ0l';
  
      // Mock the external API response
      nock(apiUrl)
        .get(`/api/users/clerk/${clerkUserId}`)
        .reply(200);
  
      const res = await supertest(app).get(`/api/users/clerk/${clerkUserId}`);
  
      expect(res.status).toBe(200);
    });
  
    it('should return 404 for a non-existent clerkUserId', async () => {
      const clerkUserId = 'non-existent-user';
  
      // Mock the external API to return a 404
      nock(apiUrl)
        .get(`/api/users/clerk/${clerkUserId}`)
        .reply(404);
  
      const res = await supertest(app).get(`/api/users/clerk/${clerkUserId}`);
  
      expect(res.status).toBe(404);
      // You can add further assertions based on your error handling in the controller
    });
});