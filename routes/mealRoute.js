const express = require('express');
const router = express.Router();
const { getMealFromDate, getMealFromCurrentDate, deleteFoodFromMeal, deleteFoodFromCurrentDate, deleteMeal } = require('../controller/mealController')
const { insertFoodIntoMeal } = require('../controller/foodController')
const getUserById = require('../middleware/getUserById');


// Middleware to get user by ID
router.use('/clerk/:clerkUserId', getUserById);

// Get meals from Current Date
router.get('/clerk/:clerkUserId', getMealFromCurrentDate)

// Get meals from Date
router.get('/clerk/:clerkUserId/date/:date', getMealFromDate);

// Insert food in a meal
router.post('/clerk/:clerkUserId/foods', insertFoodIntoMeal);

// Insert food in a meal for a speficied date
router.post('/clerk/:clerkUserId/foods/date/:date', insertFoodIntoMeal);

// Delete a single food item from a meal on the current date by meal ID, meal type, and food index
router.delete("/clerk/:clerkUserId/foods/:mealId/:mealType/:foodIndex", deleteFoodFromMeal); // Existing route for deleting with date

// Delete a single food item from the current date's meal
router.delete("/clerk/:clerkUserId/foods/:mealId/:mealType/:foodIndex", deleteFoodFromCurrentDate); // New route

// Delete a meal from ID
router.delete('/clerk/:clerkUserId/:mealId', deleteMeal) // in the body add the meal id


module.exports = router;