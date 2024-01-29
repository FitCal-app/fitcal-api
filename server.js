const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/productModel');
const app = express();

app.use(express.json());

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


mongoose.connect('mongodb+srv://admin:zhhCF6PCtx7bMP6@fitcal.ywzg4zz.mongodb.net/FitCal-API?retryWrites=true&w=majority')
.then(() => {
    console.log('Connected to MongoDB')

    app.listen(3001, () => {
        console.log('Listening on port 3001')
    })
}).catch((err) => {
    console.log(err)
})