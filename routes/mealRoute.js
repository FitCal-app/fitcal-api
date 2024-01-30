const express = require('express');
const router = express.Router();
const { getMealFromId, getMealFromDate, getMealFromCurrentDate, insertMeal } = require('../controller/mealController')


// Get meals from Current Date
router.get('/', getMealFromCurrentDate)

// Get meals from ID
router.get('/:id', getMealFromId)

// Get meals from Date
router.get('/date/:date', getMealFromDate)

// Insert a meal
router.post('/', insertMeal)


module.exports = router;