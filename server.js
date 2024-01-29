require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/productModel');
const app = express();

const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({extended: false}));

// routes
app.get('/', (req, res) => {
    res.send('Hello node API')
})


// Get all products
app.get('/products', async(req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (err) {
        console.log(error.message);
        res.status(500).json({message: error.message});
    }
})

// Get single product from ID
app.get('/products/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const product = await Product.findById(id);
        res.status(200).json(product);
    } catch (err) {
        console.log(error.message);
        res.status(500).json({message: error.message});
    }
})

// Insert a single product
app.post('/products', async(req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(200).json(product);
    } catch (err) {
        console.log(error.message);
        res.status(500).json({message: error.message});
    }
})

// Update a single product              NON FUNZIONAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
app.put('/products/:id', async(req, res) => {
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
})


mongoose.connect(MONGO_URL)
.then(() => {
    console.log('Connected to MongoDB')

    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`)
    })
}).catch((err) => {
    console.log(err)
})