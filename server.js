const express = require('express')
const mongoose = require('mongoose')
const app = express()

// routes
app.get('/', (req, res) => {
    res.send('Hello node API')
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