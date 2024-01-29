require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const produstRoute = require('./routes/productRoute');
const userRoute = require('./routes/userRoute');
const errorMiddleware = require('./middleware/errorMiddleware');
const cors = require('cors');

const app = express();

const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT;
const FRONTEND = process.env.FRONTEND;

var corsOptions = {
    origin: FRONTEND,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: false}));


// Routes
app.use('/api/products', produstRoute);
app.use('/api/users', userRoute);

app.get('/', (req, res) => {
    res.send('Hello node API')
})

app.use(errorMiddleware);


mongoose.connect(MONGO_URL)
.then(() => {
    console.log('Connected to MongoDB')

    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`)
    })
}).catch((err) => {
    console.log(err)
})