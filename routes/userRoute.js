const express = require('express');
const router = express.Router();
const { getUserByClerkUserId, updateUserByClerkUserId, deleteUserByClerkUserId } = require('../controller/userController')


// Get usert by using clerkUserId
router.get('/clerk/:clerkUserId', getUserByClerkUserId)

// Update a single user by using clerkUserId
router.patch('/clerk/:clerkUserId', updateUserByClerkUserId)

// Delete a single user by using clerkUserId
router.delete('/clerk/:clerkUserId', deleteUserByClerkUserId)


module.exports = router;