const mongoose = require('mongoose');
const Food = require('./foodModel'); // Import the Food model

const mealSchema = mongoose.Schema(
    {
        breakfast: {
            type: [Food.schema],
            required:false
        },
        lunch: {
            type: [Food.schema],
            required: false
        },
        dinner : {
            type: [Food.schema],
            required: false
        },
        snacks: {
            type: [Food.schema],
            required: false
        }
    },
    {
        timestamps: true
    }
)

const Meal = mongoose.model('Meal', mealSchema);

module.exports = Meal;