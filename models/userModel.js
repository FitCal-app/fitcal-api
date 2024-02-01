const mongoose = require('mongoose');
const Meal = require('./mealModel'); // Import the Meal model

const userSchema = mongoose.Schema(
    {
        clerkUserId: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: [false, "Please enter a email address"],
            unique: true
        },
        firstName: {
            type: String,
            required: [false, "Please enter a first name"]
        },
        lastName : {
            type: String,
            required: [false, "Please enter a last name"]
        },
        password : {
            type: String,
            required: [false, "Please enter a password"]
        },
        image : {
            type: String,
            required: false
        },
        gender : {
            type: String,
            required: [false, "Please enter a gender"]
        },
        height: {
            type: Number,
            required: [false, "Please enter the height"]
        },
        weight: {
            type: Number,
            required: [false, "Please enter the weight"]
        },
        needs: {
            calories: {
                type: Number,
                required: false
            },
            carbohydrates: {
                type: Number,
                required: false
            },
            proteins: {
                type: Number,
                required: false
            },
            fats: {
                type: Number,
                required: false
            }
        },
        history: {
            type: [Meal.schema],
            required: false,
            defaul: []
        },
        personal_products: {
            type: Array,
            required: false,
            defaul: []
        },
        scanned_products: {
            type: Array,
            required: false,
            defaul: []
        }
    },
    {
        timestamps: true
    }
)

const User = mongoose.model('User', userSchema);

module.exports = User;