const express = require('express');
const router = express.Router();
const { getUserByClerkUserId, insertUser, updateUser, updateUserByClerkUserId, deleteUser, deleteUserByClerkUserId } = require('../controller/userController')


// Get usert by using clerkUserId
router.get('/clerk/:clerkUserId', getUserByClerkUserId)

// Insert a single user
router.post('/', insertUser)

// Update a single user
router.patch('/:id', updateUser)

// Update a single user by using clerkUserId
router.patch('/clerk/:clerkUserId', updateUserByClerkUserId)

// Delete a single user
router.delete('/:id', deleteUser)

// Delete a single user by using clerkUserId
router.delete('/clerk/:clerkUserId', deleteUserByClerkUserId)


module.exports = router;