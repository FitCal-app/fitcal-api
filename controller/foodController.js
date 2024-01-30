const Meal = require('../models/mealModel');
const asyncHandler = require('express-async-handler');

// Insert food into a meal
const insertFoodIntoMeal = asyncHandler(async (req, res) => {
    try {
        const { user } = req; // Access the user from req.user
        const { mealType } = req.body; // Meal type (breakfast, lunch, dinner, snacks)
        const { grams, barcode } = req.body.food; // Food details

        // Validate if the mealType is valid
        if (!['breakfast', 'lunch', 'dinner', 'snacks'].includes(mealType)) {
            res.status(400);
            throw new Error("Invalid meal type. Please choose from breakfast, lunch, dinner, or snacks.");
        }

        // Create the food object
        const food = { grams, barcode };

        // Find the user's latest meal (assuming history is in chronological order)
        const latestMeal = user.history[user.history.length - 1];

        if (latestMeal) {
            // Add the food to the specified mealType array
            latestMeal[mealType].push(food);
        } else {
            // If no meals in history, create a new meal
            const newMeal = {
                [mealType]: [food],
            };
            user.history.push(newMeal);
        }

        // Save the updated user
        await user.save();

        res.status(200).json(user.history);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = {
    insertFoodIntoMeal,
};