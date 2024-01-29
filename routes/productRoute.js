const express = require('express');
const router = express.Router();
const { getProducts, getProduct, insertProduct, updateProduct, deleteProduct } = require('../controller/productController')


// Get all products
router.get('/', getProducts)

// Get single product from ID
router.get('/:id', getProduct)

// Insert a single product
router.post('/', insertProduct)

// Update a single product              NON FUNZIONAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
router.put('/:id', updateProduct)

// Delete a single product
router.delete('/:id', deleteProduct)


module.exports = router;