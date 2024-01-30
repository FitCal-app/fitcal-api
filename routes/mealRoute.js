const express = require('express');
const router = express.Router();
const { getMealFromDate, getMealFromCurrentDate, deleteMeal } = require('../controller/mealController')
const { insertFoodIntoMeal } = require('../controller/foodController')
const getUserById = require('../middleware/getUserById');


// Middleware to get user by ID
router.use('/:id', getUserById);

// Get meals from Current Date
router.get('/:id', getMealFromCurrentDate)

// Get meals from Date
router.get('/:id/date/:date', getMealFromDate);

// Insert food in a meal
router.post('/:id/foods', insertFoodIntoMeal);

// Delete a meal from ID
router.delete('/:id/:mealId', deleteMeal) // in the body add the meal id


module.exports = router;