const Meal = require('../models/mealModel');
const asyncHandler = require('express-async-handler');


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

        // Find meals in the user's history within the specified date range
        const meals = user.history.filter((meal) => {
            const mealCreatedAt = meal.createdAt >= startDate && meal.createdAt <= endDate;
            return mealCreatedAt;
        });

        if (!meals.length) {
            res.status(404);
            throw new Error(`No meals found for the date: ${requestedDate}`);
        }

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

        // Find the meal in the user's history for the current date
        const meal = user.history.find((meal) => {
            const mealDate = meal.createdAt.toISOString().split('T')[0];
            return mealDate === currentDate;
        });

        if (!meal) {
            res.status(404);
            throw new Error("Meal not found for the current date");
        }

        res.status(200).json(meal);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete meal
const deleteMeal = asyncHandler(async (req, res) => {
    try {
        const { user } = req;
        const mealId = req.params.mealId;

        // Find the index of the meal in the user's history
        const mealIndex = user.history.findIndex((meal) => meal._id.toString() === mealId);

        if (mealIndex === -1) {
            res.status(404);
            throw new Error(`Cannot find any meal with ID ${mealId}`);
        }

        // Remove the deleted meal from the user's history
        const deletedMeal = user.history.splice(mealIndex, 1)[0];
        await user.save();

        res.status(200).json(deletedMeal);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a single food item from a meal
const deleteFoodFromMeal = asyncHandler(async (req, res) => {
    try {
      const { user } = req;
      const { date, mealId, mealType, foodIndex } = req.params;
      const foodIndexInt = parseInt(foodIndex, 10);
  
      // ... (mealType and date format validations) ...
  
      // Find the meal for the specified date
      let mealIndex = user.history.findIndex(meal => new Date(meal.createdAt).toDateString() === new Date(date).toDateString() && meal._id.toString() === mealId);
  
      if (mealIndex === -1) {
        res.status(404);
        throw new Error(`No meal found for the date: ${date} and mealId: ${mealId}`);
      }
  
      const meal = user.history[mealIndex]; // Get the meal object by its index
  
      // Check if the food item exists at the specified index and mealType
      if (!meal[mealType] || meal[mealType].length <= foodIndexInt) {
        res.status(404);
        throw new Error(
          `No food item found at index ${foodIndex} in meal type ${mealType}`
        );
      }
  
      // Remove the food item from the mealType array
      meal[mealType].splice(foodIndexInt, 1);
  
      // Update the meal in the user.history array (only if the mealType array is not empty)
      if (meal[mealType].length === 0) {
          delete meal[mealType]; 
      }
  
      user.history[mealIndex] = meal; 
  
      // Save the updated user
      await user.save();
  
      res.status(200).json(user.history);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});
  
module.exports = {
    getMealFromDate,
    getMealFromCurrentDate,
    deleteFoodFromMeal,
    deleteMeal
}