const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');


// Get all products
const getProducts = asyncHandler(async(req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (err) {
        res.status(500);
        throw new Error(err.message);
    }
})

// Get single product from ID
const getProduct = asyncHandler(async(req, res) => {
    try {
        const {id} = req.params;
        const product = await Product.findById(id);
        res.status(200).json(product);
    } catch (err) {
        res.status(500);
        throw new Error(err.message);
    }
})

// Insert a single product
const insertProduct = asyncHandler(async(req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(200).json(product);
    } catch (err) {
        res.status(500);
        throw new Error(err.message);
    }
})

// Update a single product              NON FUNZIONAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
const updateProduct = asyncHandler(async(req, res) => {
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body);

        // Cant find product in db with this id
        if (!product) {
            res.status(404);
            throw new Error(`cannot find any product with ID ${id}`);
        }

        const updatedProduct =  await Product.findById(id);
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500);
        throw new Error(err.message);
    }
})

// Delete a single product
const deleteProduct = asyncHandler(async(req, res) =>{
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndDelete(id);
        if(!product){
            res.status(404);
            throw new Error(`cannot find any product with ID ${id}`);
        }
        res.status(200).json(product);
        
    } catch (err) {
        res.status(500);
        throw new Error(err.message);
    }
})


module.exports = {
    getProducts,
    getProduct,
    insertProduct,
    updateProduct,
    deleteProduct
}