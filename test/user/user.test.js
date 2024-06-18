const supertest = require('supertest');
const { app, startServer, closeServer } = require('../../server'); // Import the app object
const nock = require('nock');


const User = require('../../models/userModel');

const apiUrl = 'https://fitcal-api.kevinazemi.com';

describe('API Integration Tests', () => {
  beforeAll(async () => {
    await startServer();
  });

  afterAll(async () => {
    await closeServer();
  });

  describe('getUser (External API Integration)', () => {

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


  describe('updateUserNeeds (External API Integration)', () => {
    it('should successfully update user needs for a valid clerkUserId', async () => {
      const clerkUserId = 'user_2h4MM1Eqxwsur9rGAN4lTN1dJ0l';
      const updatedNeedsPayload = { // The payload sent in the request
        needs: {
          calories: 1750,
          carbohydrates: 200,
          proteins: 130,
          fats: 50
        }
      };

      const fullUserObject = { // The response expected from the API
        needs: {
          calories: 1678,
          carbohydrates: 189,
          proteins: 126,
          fats: 47
        },
        _id: "666429765c0980bffb1b41ee",
        clerkUserId: "user_2hZGHWvp7wON4ysHFAVqgj11uOz",
        personal_products: [],
        history: [],
        createdAt: "2024-06-08T09:50:46.514Z",
        updatedAt: "2024-06-08T09:55:47.200Z",
        __v: 0
      };

      // Mock the external API response to return the full user object
      // with the updated needs merged in
      nock(apiUrl)
        .patch(`/api/users/clerk/${clerkUserId}`, updatedNeedsPayload) // Use the payload in the mock
        .reply(200, { 
          ...fullUserObject, 
          needs: updatedNeedsPayload.needs // Merge the updated needs from the payload
        });

      const res = await supertest(app)
        .patch(`/api/users/clerk/${clerkUserId}`)
        .send(updatedNeedsPayload); // Send the payload in the request

      expect(res.status).toBe(200);

      // Assert that the needs in the response have been updated
      expect(res.body.needs).toEqual(updatedNeedsPayload.needs); 
    });

    it('should return 404 for a non-existent clerkUserId', async () => {
      const clerkUserId = 'non-existent-user';
      const updatedNeeds = { /* ...needs data... */ };

      // Mock the external API to return a 404
      nock(apiUrl)
        .patch(`/api/users/clerk/${clerkUserId}`, updatedNeeds)
        .reply(404); 

      const res = await supertest(app)
        .patch(`/api/users/clerk/${clerkUserId}`)
        .send(updatedNeeds);

      expect(res.status).toBe(404);
      // Further assertions for error handling in your controller
    });
  });


  describe('deleteUser (External API Integration)', () => {
    it('should successfully delete a user for a valid clerkUserId', async () => {
      const clerkUserId = 'user_2h4MM1Eqxwsur9rGAN4lTN1dJ0l';

      const existingUser = { // Sample user data to be "deleted"
        needs: { /* ...needs data... */ },
        _id: "666429765c0980bffb1b41ee",
        clerkUserId: clerkUserId,
        // ... other user data
      };

      // Mock the database response for findOneAndDelete
      const userMock = jest.spyOn(User, 'findOneAndDelete').mockResolvedValue(existingUser);


      const res = await supertest(app).delete(`/api/users/clerk/${clerkUserId}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(existingUser); 

      // Check that findOneAndDelete was called with the correct clerkUserId
      expect(userMock).toHaveBeenCalledWith({ clerkUserId });
    });

    it('should return 404 for a non-existent clerkUserId', async () => {
      const clerkUserId = 'non-existent-user';

      // Mock the database response for findOneAndDelete
      jest.spyOn(User, 'findOneAndDelete').mockResolvedValue(null); // User not found

      // You don't need to mock Redis here since the user doesn't exist
      
      const res = await supertest(app).delete(`/api/users/clerk/${clerkUserId}`);

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: `Cannot find any user with Clerk User ID ${clerkUserId}` });
    });
  });
});