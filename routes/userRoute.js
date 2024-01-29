const express = require('express');
const router = express.Router();
const { getUser, insertUser, updateUser, deleteUser } = require('../controller/userController')


// Get usert from ID
router.get('/:id', getUser)

// Insert a single user
router.post('/', insertUser)

// Update a single user              NON FUNZIONAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
router.put('/:id', updateUser)

// Delete a single user
router.delete('/:id', deleteUser)


module.exports = router;