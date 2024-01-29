const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "Please enter a email address"],
            unique: true
        },
        firstName: {
            type: String,
            required: [true, "Please enter a first name"]
        },
        lastName : {
            type: String,
            required: [true, "Please enter a last name"]
        },
        password : {
            type: String,
            required: [true, "Please enter a password"]
        },
        image : {
            type: String,
            required: false
        },
        gender : {
            type: String,
            required: [true, "Please enter a gender"]
        },
        height: {
            type: Number,
            required: [true, "Please enter the height"]
        },
        weight: {
            type: Number,
            required: [true, "Please enter the weight"]
        },
        needs: {
            calories: {
                type: Number,
                required: true
            },
            carbohydrates: {
                type: Number,
                required: true
            },
            proteins: {
                type: Number,
                required: true
            },
            fats: {
                type: Number,
                required: true
            }
        },
        history: {
            type: Array,
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