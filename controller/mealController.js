const Meal = require('../models/mealModel');
const asyncHandler = require('express-async-handler');


// Get meal from ID
const getMealFromId = asyncHandler(async(req, res) => {
    try {
        const {id} = req.params;
        const meal = await Meal.findById(id);
        res.status(200).json(meal);
    } catch (err) {
        res.status(500);
        throw new Error(err.message);
    }
})

// Get meals from Date
const getMealFromDate = asyncHandler(async(req, res) => {
    try {
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

        // Assuming you have a field named 'createdAt' in your Meal model
        const meal = await Meal.findOne({
            createdAt: {
                $gte: startDate,
                $lt: endDate,
            },
        });

        if (!meal) {
            res.status(404);
            throw new Error(`Meal not found for the date: ${requestedDate}`);
        }

        res.status(200).json(meal);
    } catch (err) {
        res.status(500);
        throw new Error(err.message);
    }
})

// Get today meals
const getMealFromCurrentDate = asyncHandler(async(req, res) => {
    try {
        const currentDate = new Date().toISOString().split('T')[0];

        const meal = await Meal.findOne({
            createdAt: {
                $gte: new Date(currentDate + 'T00:00:00.000Z'),
                $lt: new Date(currentDate + 'T23:59:59.999Z'),
            },
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


// Insert a meal
const insertMeal = asyncHandler(async(req, res) => {
    try {
        const meal = await Meal.create(req.body);
        res.status(200).json(meal);
    } catch (err) {
        res.status(500);
        throw new Error(err.message);
    }
})


module.exports = {
    getMealFromId,
    getMealFromDate,
    getMealFromCurrentDate,
    insertMeal
}