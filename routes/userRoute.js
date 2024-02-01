const express = require('express');
const router = express.Router();
const { getUser, getUserByEmail, insertUser, updateUser, deleteUser } = require('../controller/userController')


// Get usert from ID
router.get('/:id', getUser)

// Get usert by Email
router.get('/:users-by-email', getUserByEmail)

// Insert a single user
router.post('/', insertUser)

// Update a single user
router.patch('/:id', updateUser)

// Delete a single user
router.delete('/:id', deleteUser)


module.exports = router;