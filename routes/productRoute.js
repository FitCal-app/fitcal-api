const express = require('express');
const router = express.Router();
const { getProducts, getProduct, insertProduct, updateProduct } = require('../controller/productController')


// Get all products
router.get('/', getProducts)

// Get single product from ID
router.get('/:id', getProduct)

// Insert a single product
router.post('/', insertProduct)

// Update a single product              NON FUNZIONAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
router.put('/:id', updateProduct)


module.exports = router;