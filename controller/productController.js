const Product = require('../models/productModel');


// Get all products
const getProducts = async(req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (err) {
        console.log(error.message);
        res.status(500).json({message: error.message});
    }
}

// Get single product from ID
const getProduct = async(req, res) => {
    try {
        const {id} = req.params;
        const product = await Product.findById(id);
        res.status(200).json(product);
    } catch (err) {
        console.log(error.message);
        res.status(500).json({message: error.message});
    }
}

// Insert a single product
const insertProduct = async(req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(200).json(product);
    } catch (err) {
        console.log(error.message);
        res.status(500).json({message: error.message});
    }
}

// Update a single product              NON FUNZIONAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
const updateProduct = async(req, res) => {
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body);

        // Cant find product in db with this id
        if (!product) {
            return res.status(404).json({message: `Product not found with ID ${id}`});
        }

        const updatedProduct =  await Product.findById(id);
        res.status(200).json(updatedProduct);
    } catch (err) {
        console.log(error.message);
        res.status(500).json({message: error.message});
    }
}


module.exports = {
    getProducts,
    getProduct,
    insertProduct,
    updateProduct
}