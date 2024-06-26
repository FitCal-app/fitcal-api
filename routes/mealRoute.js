const express = require('express');
const router = express.Router();
const { getMealFromDate, deleteFoodFromMealByDate } = require('../controller/mealController')
const { insertFoodIntoMeal } = require('../controller/foodController')
const getUserById = require('../middleware/getUserById');


// Middleware to get user by ID
router.use('/clerk/:clerkUserId', getUserById);

// Get meals from Date
router.get('/clerk/:clerkUserId/date/:date', getMealFromDate);

// Insert food in a meal for a speficied date
router.post('/clerk/:clerkUserId/foods/date/:date', insertFoodIntoMeal);

// Delete a single food item from a meal on a specific date
router.delete("/clerk/:clerkUserId/foods/date/:date/:mealId/:mealType/:foodIndex", deleteFoodFromMealByDate);


module.exports = router;