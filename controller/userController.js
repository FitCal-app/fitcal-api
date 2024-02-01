const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');


// Get single user from ID
const getUser = asyncHandler(async(req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (err) {
        res.status(500);
        throw new Error(err.message);
    }
})

// Get single user by Email
const getUserByEmail = asyncHandler(async (req, res) => {
    try {
      const { email } = req.params;
      
      // Assuming you have a 'User' model defined using Mongoose
      const user = await User.findOne({ email });
  
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
  
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
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

// Delete a single user by email
const deleteUserByEmail = asyncHandler(async (req, res) => {
    try {
      const { email } = req.params;
      
      // Assuming you have a 'User' model defined using Mongoose
      const user = await User.findOneAndDelete({ email });
  
      if (!user) {
        res.status(404);
        throw new Error(`Cannot find any user with email ${email}`);
      }
  
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
});  


module.exports = {
    getUser,
    getUserByEmail,
    insertUser,
    updateUser,
    deleteUser,
    deleteUserByEmail
}