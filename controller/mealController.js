const Meal = require('../models/mealModel');
const asyncHandler = require('express-async-handler');

const redisClient = require('../lib/redis.js');
redisClient.on('error', (error) => console.error(`Redis Error: ${error}`));

// Get meals from Date
const getMealFromDate = asyncHandler(async (req, res) => {
    try {
        const { user } = req; // Access the user from req.user
        const requestedDate = req.params.date;

        // Validate if the requested date is in a valid format (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(requestedDate)) {
            res.status(400);
            throw new Error("Invalid date format. Please use YYYY-MM-DD.");
        }

        // Convert the requested date to a time range for the whole day
        const startDate = new Date(requestedDate + 'T00:00:00.000Z');
        const endDate = new Date(requestedDate + 'T23:59:59.999Z');

        // Check if meal exists in Redis
        let redisKey = 'meal_' + requestedDate + '_' + user.clerkUserId;
        let cachedMeal = await redisClient.get(redisKey);

        if (cachedMeal) {
            res.status(200).json(JSON.parse(cachedMeal));
            return;
        }

        // Find meals in the user's history within the specified date range
        const meals = user.history.filter((meal) => {
            const mealCreatedAt = meal.createdAt >= startDate && meal.createdAt <= endDate;
            return mealCreatedAt;
        });

        if (!meals.length) {
            res.status(404);
            throw new Error(`No meals found for the date: ${requestedDate}`);
        }

        // Store the meal in Redis for future requests with ttl 20min
        await redisClient.set(redisKey, JSON.stringify(meals[0]), 'EX', 1200);

        // Return the first element of the meals array
        res.status(200).json(meals[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Get today meals of a user
const getMealFromCurrentDate = asyncHandler(async (req, res) => {
    try {
        const { user } = req; // Access the user from req.user

        const currentDate = new Date().toISOString().split('T')[0];

        // Check if meal exists in Redis
        let redisKey = 'meal_' + currentDate + '_' + user.clerkUserId;
        let cachedMeal = await redisClient.get(redisKey); 

        if (cachedMeal) {
            res.status(200).json(JSON.parse(cachedMeal));
            return;
        }

        // Find the meal in the user's history for the current date
        const meal = user.history.find((meal) => {
            const mealDate = meal.createdAt.toISOString().split('T')[0];
            return mealDate === currentDate;
        });

        if (!meal) {
            res.status(404);
            throw new Error("Meal not found for the current date");
        }

        // Store the meal in Redis for future requests with ttl 20min
        await redisClient.set(redisKey, JSON.stringify(meal), 'EX', 1200);

        res.status(200).json(meal);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Delete a single food item from a meal on the current date
const deleteFoodFromCurrentDate = asyncHandler(async (req, res) => {
    try {
        const { user } = req;
        const { mealId, mealType, foodIndex } = req.params;
        const foodIndexInt = parseInt(foodIndex, 10);
  
        const currentDate = new Date().toISOString().split("T")[0];
        const redisKey = 'meal_' + currentDate + '_' + user.clerkUserId;
  
        // Validate mealType
        if (!["breakfast", "lunch", "dinner", "snacks"].includes(mealType)) {
            res.status(400);
            throw new Error("Invalid meal type. Please choose from breakfast, lunch, dinner, or snacks.");
        }      
  
        // Find the meal for the current date
        const mealIndex = user.history.findIndex(
            (meal) =>
            new Date(meal.createdAt).toDateString() ===
                new Date(currentDate).toDateString() &&
            meal._id.toString() === mealId
        );
  
        if (!meal) {
            res.status(404);
            throw new Error(`No meal found for the current date and mealId: ${mealId}`);
        }

        // Check if the food item exists at the specified index and mealType
        if (!meal[mealType] || meal[mealType].length <= foodIndexInt) {
            res.status(404);
            throw new Error(
                `No food item found at index ${foodIndex} in meal type ${mealType}`
            );
        }

        // Remove the food item from the meal
        meal[mealType].splice(foodIndexInt, 1);
        
        // Update the meal in user.history directly
        user.history[mealIndex] = meal; 

        // Save the updated user
        await user.save();

        // Check if any food items are left in any of the meals
        const hasAnyFoods = Object.values(meal).some(foods => foods && foods.length > 0);

        if (!hasAnyFoods) {
            // If the meal is empty, delete the key from Redis
            await redisClient.del(redisKey);
        } else {
            // Update user in redis as well
            await redisClient.set(redisKey, JSON.stringify(meal));
        }

        res.status(200).json(deletedMeal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
  
// Delete a single food item from a meal on a specific date
const deleteFoodFromMealByDate = asyncHandler(async (req, res) => {
    try {
        const { user } = req;
        const { date, mealId, mealType, foodIndex } = req.params;
        const foodIndexInt = parseInt(foodIndex, 10);
        const redisKey = 'meal_' + date + '_' + user.clerkUserId;

        // Validate mealType
        if (!["breakfast", "lunch", "dinner", "snacks"].includes(mealType)) {
            res.status(400);
            throw new Error("Invalid meal type. Please choose from breakfast, lunch, dinner, or snacks.");
        }

        // Find the meal for the specified date
        const mealIndex = user.history.findIndex(
            (meal) =>
                new Date(meal.createdAt).toDateString() ===
                    new Date(date).toDateString() &&
                meal._id.toString() === mealId
        );

        if (mealIndex === -1) {
            res.status(404);
            throw new Error(`No meal found for the date: ${date} and mealId: ${mealId}`);
        }

        const meal = user.history[mealIndex]; // Retrieve the meal object AFTER finding it

        // Check if the food item exists at the specified index and mealType
        if (!meal[mealType] || meal[mealType].length <= foodIndexInt) {
            res.status(404);
            throw new Error(
                `No food item found at index ${foodIndex} in meal type ${mealType}`
            );
        }

        // Remove the food item from the mealType array
        meal[mealType].splice(foodIndexInt, 1);

        // Delete the mealType property if the array is empty
        if (meal[mealType].length === 0) {
            delete meal[mealType];
        }

        // Update the meal in the user.history array
        user.history[mealIndex] = meal;

        // Save the updated user in database
        await user.save();
        
        // Check if any food items are left in any of the meals
        const hasAnyFoods = Object.values(meal).some(foods => foods && foods.length > 0);

        if (!hasAnyFoods) {
            // If the meal is empty, delete the key from Redis
            await redisClient.del(redisKey);
        } else {
            // Update user in redis as well
            await redisClient.set(redisKey, JSON.stringify(meal));
        }
        
        res.status(200).json(meal);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = {
    getMealFromDate,
    getMealFromCurrentDate,
    deleteFoodFromCurrentDate,
    deleteFoodFromMealByDate
}