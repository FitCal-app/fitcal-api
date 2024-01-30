const mongoose = require('mongoose');

const foodSchema = mongoose.Schema(
    {
        grams: {
            type: Number,
            required: [true, "Please enter the grams"]
        },
        barcode : {
            type: String,
            required: [true, "Please enter a barcode"]
        }
    },
    {
        timestamps: false
    }
)

const Food = mongoose.model('Food', foodSchema);

module.exports = Food;