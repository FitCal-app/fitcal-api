const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter a product name"]
        },
        barcode: {
            type: String,
            required: true
        },
        img : {
            type: String,
            required: false
        },
        calories: {
            type: Number,
            required: true
        },
        carbohydrates: {
            type: Number,
            required: true
        },
        fat: {
            type: Number,
            required: true
        },
        proteins: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const Product = mongoose.model('Product', productSchema);

module.exports = Product;