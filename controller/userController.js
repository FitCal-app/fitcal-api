const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

const Redis = require('ioredis');
// Create Redis client using IORedis
const redisClient = new Redis(process.env.REDIS_URL);
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
            res.status(404);
            throw new Error(`Cannot find any user with Clerk User ID ${clerkUserId}`);
        }
        
        // Store the user in Redis for future requests
        await redisClient.set(clerkUserId, JSON.stringify(user));

        res.status(200).json(user);
    } catch (err) {
        res.status(500);
        throw new Error(err.message);
    }
});

// Insert a single user
const insertUser = asyncHandler(async(req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(200).json(user);
    } catch (err) {
        res.status(500);
        throw new Error(err.message);
    }
})

// Update a single user
const updateUser = asyncHandler(async(req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findByIdAndUpdate(id, req.body, { new: true });

        // Cant find user in db with this id
        if (!user) {
            res.status(404);
            throw new Error(`cannot find any user with ID ${id}`);
        }

        const updatedUser =  await User.findById(id);
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500);
        throw new Error(err.message);
    }
})

// Update a single user using Clerk User ID
const updateUserByClerkUserId = asyncHandler(async (req, res) => {
    try {
        const { clerkUserId } = req.params;
        const updatedUser = await User.findOneAndUpdate({ clerkUserId }, req.body, { new: true });

        // Update user in redis as well
        await redisClient.set(clerkUserId, JSON.stringify(updatedUser));

        if (!updatedUser) {
            res.status(404);
            throw new Error(`Cannot find any user with Clerk User ID ${clerkUserId}`);
        }

        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500);
        throw new Error(err.message);
    }
});


// Delete a single user
const deleteUser = asyncHandler(async(req, res) =>{
    try {
        const {id} = req.params;
        const user = await User.findByIdAndDelete(id);
        if(!user){
            res.status(404);
            throw new Error(`cannot find any user with ID ${id}`);
        }
        res.status(200).json(user);
        
    } catch (err) {
        res.status(500);
        throw new Error(err.message);
    }
})

// Delete a single user using Clerk User ID
const deleteUserByClerkUserId = asyncHandler(async (req, res) => {
    try {
        const { clerkUserId } = req.params;
        const user = await User.findOneAndDelete({ clerkUserId });

        // Delete user from redis as well
        await redisClient.del(clerkUserId);

        if (!user) {
            res.status(404);
            throw new Error(`Cannot find any user with Clerk User ID ${clerkUserId}`);
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500);
        throw new Error(err.message);
    }
});


module.exports = {
    getUserByClerkUserId,
    insertUser,
    updateUser,
    updateUserByClerkUserId,
    deleteUser,
    deleteUserByClerkUserId
}