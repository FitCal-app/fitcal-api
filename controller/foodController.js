const asyncHandler = require('express-async-handler');

// Insert food into a meal
const insertFoodIntoMealCurrentDate = asyncHandler(async (req, res) => {
    try {
        const { user } = req; // Access the user from req.user
        const { mealType } = req.body; // Meal type (breakfast, lunch, dinner, snacks)
        const { grams, barcode } = req.body.food; // Food details

        // Validate if the mealType is valid
        if (!['breakfast', 'lunch', 'dinner', 'snacks'].includes(mealType)) {
            res.status(400);
            throw new Error("Invalid meal type. Please choose from breakfast, lunch, dinner, or snacks.");
        }

        // Get the current date in the format "YYYY-MM-DD"
        const currentDate = new Date().toISOString().split('T')[0];

        // Find the user's meal with the current date
        const todayMeal = user.history.find((meal) => meal.createdAt === currentDate);

        if (todayMeal) {
            // If a meal for today exists, add the food to the specified mealType array
            todayMeal[mealType].push({ grams, barcode });
        } else {
            // If no meal for today, create a new meal for the current date
            const newMeal = {
                createdAt: currentDate,
                [mealType]: [{ grams, barcode }],
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


const insertFoodIntoMealFromDate = asyncHandler(async (req, res) => {
    try {
        const { user } = req; // Access the user from req.user
        const { mealType } = req.body; // Meal type (breakfast, lunch, dinner, snacks)
        const { grams, barcode } = req.body.food; // Food details
        const { date } = req.params; // Date in "YYYY-MM-DD" format

        // Validate if the mealType is valid
        if (!['breakfast', 'lunch', 'dinner', 'snacks'].includes(mealType)) {
            res.status(400);
            throw new Error("Invalid meal type. Please choose from breakfast, lunch, dinner, or snacks.");
        }

        // Find the user's meal with the specified date
        const mealWithDate = user.history.find((meal) => meal.createdAt === date);

        if (mealWithDate) {
            // If a meal for the specified date exists, add the food to the specified mealType array
            mealWithDate[mealType].push({ grams, barcode });
        } else {
            // If no meal for the specified date, create a new meal for that date
            const newMeal = {
                createdAt: date,
                [mealType]: [{ grams, barcode }],
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
    insertFoodIntoMealCurrentDate,
    insertFoodIntoMealFromDate
};
