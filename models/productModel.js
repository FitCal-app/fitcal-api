const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter a product name"]
        },
        barcode: {
            type: String,
            required: [true, "Please enter a barcode"]
        },
        img : {
            type: String,
            required: false
        },
        calories: {
            type: Number,
            required: [true, "Please enter calories"]
        },
        carbohydrates: {
            type: Number,
            required: [true, "Please enter carbohydrates"]
        },
        fats: {
            type: Number,
            required: [true, "Please enter fats"]
        },
        proteins: {
            type: Number,
            required: [true, "Please enter proteins"]
        }
    },
    {
        timestamps: true
    }
)

const Product = mongoose.model('Product', productSchema);

module.exports = Product;