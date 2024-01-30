const mongoose = require('mongoose');

const mealSchema = mongoose.Schema(
    {
        breakfast: {
            type: Array,
            required:false
        },
        lunch: {
            type: Array,
            required: false
        },
        dinner : {
            type: Array,
            required: false
        },
        snacks: {
            type: Array,
            required: false
        }
    },
    {
        timestamps: true
    }
)

const Meal = mongoose.model('Meal', mealSchema);

module.exports = Meal;