require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const produstRoute = require('./routes/productRoute');
const userRoute = require('./routes/userRoute');

const app = express();

const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({extended: false}));


// Routes
app.use('/api/products', produstRoute);
app.use('/api/users', userRoute);

app.get('/', (req, res) => {
    res.send('Hello node API')
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