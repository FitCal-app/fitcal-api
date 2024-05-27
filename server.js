require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

const userRoute = require('./routes/userRoute');
const mealRoute = require('./routes/mealRoute');
const webhookRoute = require('./routes/webhookRoute');

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

//app.use(cors(corsOptions));
app.use(cors());
//app.use(express.json());    can't use this with clerk due to the middleware
app.use(express.urlencoded({extended: false}));


// Routes
app.use('/api/users', bodyParser.json(), userRoute);
app.use('/api/meals', bodyParser.json(), mealRoute);
app.use('/api/webhooks', bodyParser.raw({ type: 'application/json' }), webhookRoute);

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