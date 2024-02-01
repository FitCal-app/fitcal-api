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
            unique: true
        },
        firstName: {
            type: String
        },
        lastName : {
            type: String
        },
        password : {
            type: String
        },
        image : {
            type: String
        },
        gender : {
            type: String
        },
        height: {
            type: Number
        },
        weight: {
            type: Number
        },
        needs: {
            calories: {
                type: Number
            },
            carbohydrates: {
                type: Number
            },
            proteins: {
                type: Number
            },
            fats: {
                type: Number
            }
        },
        history: {
            type: [Meal.schema],
            defaul: []
        },
        personal_products: {
            type: Array,
            defaul: []
        }
    },
    {
        timestamps: true
    }
)

const User = mongoose.model('User', userSchema);

module.exports = User;