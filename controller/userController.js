const User = require('../models/userModel');


// Get single user from ID
const getUser = async(req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({message: err.message});
    }
}

// Insert a single user
const insertUser = async(req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(200).json(user);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({message: err.message});
    }
}

// Update a single user              NON FUNZIONAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
const updateUser = async(req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findByIdAndUpdate(id, req.body);

        // Cant find user in db with this id
        if (!user) {
            return res.status(404).json({message: `User not found with ID ${id}`});
        }

        const updatedUser =  await User.findById(id);
        res.status(200).json(updatedUser);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({message: err.message});
    }
}

// Delete a single user
const deleteUser = async(req, res) =>{
    try {
        const {id} = req.params;
        const user = await User.findByIdAndDelete(id);
        if(!user){
            return res.status(404).json({message: `cannot find any user with ID ${id}`})
        }
        res.status(200).json(user);
        
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}


module.exports = {
    getUser,
    insertUser,
    updateUser,
    deleteUser
}