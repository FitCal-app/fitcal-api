const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

const redisClient = require('../lib/redis.js');
redisClient.on('error', (error) => console.error(`Redis Error: ${error}`));

// Get single user by Clerk ID
const getUserByClerkUserId = asyncHandler(async (req, res) => {
    try {
        const { clerkUserId } = req.params;

        // Check if user exists in Redis
        let cachedUser = await redisClient.get(clerkUserId);

        if (cachedUser) {
            res.status(200).json(JSON.parse(cachedUser));
            return;
        }

        // If not in Redis, fetch from MongoDB
        const user = await User.findOne({ clerkUserId });

        if (!user) {
            res.status(404).json({ message: `Cannot find any user with Clerk User ID ${clerkUserId}` });
            return;
        }
        
        // Store the user in Redis for future requests
        await redisClient.set(clerkUserId, JSON.stringify(user));

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message }); 
    }
});


// Update a single user using Clerk User ID
const updateUserByClerkUserId = asyncHandler(async (req, res) => {
    try {
        const { clerkUserId } = req.params;
        const updatedUser = await User.findOneAndUpdate({ clerkUserId }, req.body, { new: true });

        if (!updatedUser) {
            res.status(404).json({ message: `Cannot find any user with Clerk User ID ${clerkUserId}` });
            return;
        }

        // Update user in redis
        await redisClient.set(clerkUserId, JSON.stringify(updatedUser));

        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: err.message }); 
    }
});

// Delete a single user using Clerk User ID
const deleteUserByClerkUserId = asyncHandler(async (req, res) => {
    try {
        const { clerkUserId } = req.params;
        const user = await User.findOneAndDelete({ clerkUserId });

        // Delete user from redis
        await redisClient.del(clerkUserId);

        if (!user) {
            res.status(404).json({ message: `Cannot find any user with Clerk User ID ${clerkUserId}` });
            return;
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message }); 
    }
});


module.exports = {
    getUserByClerkUserId,
    updateUserByClerkUserId,
    deleteUserByClerkUserId
}