const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

const getUserById = asyncHandler(async (req, res, next) => {
    const { clerkUserId } = req.params;

    // Find the user by Clerk ID
    const user = await User.findOne({ clerkUserId });

    if (!user) {
        res.status(404);
        throw new Error(`Cannot find any user with Clerk ID ${clerkUserId}`);
    }

    // Attach the user to the request object
    req.user = user;

    // Continue to the next middleware or route handler
    next();
});

module.exports = getUserById;