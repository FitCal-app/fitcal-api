const express = require('express');
const router = express.Router();
const { getOpenFood } = require('../controller/openFoodController')


router.get('/:barcode', getOpenFood)


module.exports = router;