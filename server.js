require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const http = require('http');

const userRoute = require('./routes/userRoute');
const mealRoute = require('./routes/mealRoute');
const webhookRoute = require('./routes/webhookRoute');
const openFoodRoute = require('./routes/openFoodRoute');

const errorMiddleware = require('./middleware/errorMiddleware');
const cors = require('cors');

const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT;
const FRONTEND = process.env.FRONTEND;

var corsOptions = {
    origin: FRONTEND,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}


const app = express();
//app.use(cors(corsOptions));
app.use(cors());
//app.use(express.json());    can't use this with clerk due to the middleware
app.use(express.urlencoded({extended: false}));

// Routes
app.use('/api/users', bodyParser.json(), userRoute);
app.use('/api/meals', bodyParser.json(), mealRoute);
app.use('/api/webhooks', bodyParser.raw({ type: 'application/json' }), webhookRoute);
app.use('/api/openfood', bodyParser.json(), openFoodRoute);

app.get('/api', (req, res) => {
    res.send('Welcome to FitCal API. Please check our docs at https://fitcal-docs.kevinazemi.com/')
})

app.use(errorMiddleware);


// Create server instance but DON'T start it yet
const server = http.createServer(app);

// Wrap the startup logic in an async function
async function startServer() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('Connected to MongoDB');

    server.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Error starting the server:', err);
  }
}

// Wrap the close logic in an async function
async function closeServer() {
  await mongoose.disconnect();
  return new Promise((resolve, reject) => {
    server.close(err => {
      if (err) {
        console.error('Error closing server:', err);
        reject(err);
      } else {
        console.log('Server closed');
        resolve();
      }
    });
  });
}

// Immediately start the server
startServer();

// Export for testing
module.exports = { app, startServer, closeServer };