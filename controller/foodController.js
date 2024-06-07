const asyncHandler = require('express-async-handler');

const redisClient = require('../lib/redis.js');
redisClient.on('error', (error) => console.error(`Redis Error: ${error}`));

// Insert food into a meal
const insertFoodIntoMeal = asyncHandler(async (req, res) => {
    try {
        const { user } = req;
        const { mealType, food } = req.body;
        const requestedDate = req.params.date || new Date().toISOString().split("T")[0]; // Use specified date or current date if not provided
        const redisKey = 'meal_' + requestedDate + '_' + user.clerkUserId;

        // Validate if the mealType is valid
        if (!["breakfast", "lunch", "dinner", "snacks"].includes(mealType)) {
            res.status(400);
            throw new Error("Invalid meal type. Please choose from breakfast, lunch, dinner, or snacks.");
        }

        // Find the index of the meal for the specified date, or create a new one if it doesn't exist
        let mealIndex = user.history.findIndex(meal => new Date(meal.createdAt).toDateString() === new Date(requestedDate).toDateString()); // Convert createdAt to date strings for comparison, ignoring the time
        
        if (mealIndex === -1) {
            // If no meal for the specified date exists, create a new meal object
            const newMeal = {
                createdAt: requestedDate,
                [mealType]: [food],
            };
            user.history.push(newMeal);
        } else {
            // If a meal exists, get the existing meal and add the food to it
            const existingMeal = user.history[mealIndex];

            // If the mealType array doesn't exist, create it
            if (!existingMeal[mealType]) {
                existingMeal[mealType] = [];
            }

            existingMeal[mealType].push(food);
            user.history[mealIndex] = existingMeal; // Update the meal in the history array
        }

        // Save the updated user
        await user.save();

        // Store the meal in Redis for future requests with ttl 20min
        await redisClient.set(redisKey, JSON.stringify(user.history), 'EX', 1200);

        res.status(200).json(user.history);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = {
    insertFoodIntoMeal
};