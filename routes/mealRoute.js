const express = require('express');
const router = express.Router();
const { getMealFromDate, getMealFromCurrentDate, deleteMeal } = require('../controller/mealController')
const { insertFoodIntoMealCurrentDate, insertFoodIntoMealFromDate } = require('../controller/foodController')
const getUserById = require('../middleware/getUserById');


// Middleware to get user by ID
router.use('/clerk/:clerkUserId', getUserById);

// Get meals from Current Date
router.get('/clerk/:clerkUserId', getMealFromCurrentDate)

// Get meals from Date
router.get('/clerk/:clerkUserId/date/:date', getMealFromDate);

// Insert food in a meal
router.post('/clerk/:clerkUserId/foods', insertFoodIntoMealCurrentDate);

// Insert food in a meal for a speficied date
router.post('/clerk/:clerkUserId/foods/date/:date', insertFoodIntoMealFromDate);

// Delete a meal from ID
router.delete('/clerk/:clerkUserId/:mealId', deleteMeal) // in the body add the meal id


module.exports = router;