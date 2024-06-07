const redisClient = require('../lib/redis.js');
redisClient.on('error', (error) => console.error(`Redis Error: ${error}`));

const asyncHandler = require('express-async-handler');

const getOpenFood = asyncHandler(async (req, res) => {
    try {
        const { barcode } = req.params;

        // Check if user exists in Redis
        let cachedFood = await redisClient.get(barcode);

        if (cachedFood) {
            res.status(200).json(JSON.parse(cachedFood));
            return;
        }

        const response = await fetch(
            `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
        );
        const data = await response.json();

        if (!data) {
            res.status(404);
            throw new Error(`Cannot find any food with barcode ${barcode}`);
        }
        
        // Store the food in Redis for future requests with ttl 20min
        await redisClient.set(barcode, JSON.stringify(data), 'EX', 1200);

        res.status(200).json(data);
    } catch (err) {
        res.status(500);
        throw new Error(err.message);
    }
});

module.exports = {
    getOpenFood
}