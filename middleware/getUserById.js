const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

const getUserById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
        res.status(404);
        throw new Error(`Cannot find any user with ID ${id}`);
    }

    // Attach the user to the request object
    req.user = user;

    // Continue to the next middleware or route handler
    next();
});

module.exports = getUserById;