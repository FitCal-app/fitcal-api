const asyncHandler = require('express-async-handler');

const redisClient = require('../lib/redis.js');
redisClient.on('error', (error) => console.error(`Redis Error: ${error}`));

const getOpenFood = asyncHandler(async (req, res) => {
    try {
        const { barcode } = req.params;

        // Check if food exists in Redis
        const redisKey = 'food_' + barcode;
        let cachedFood = await redisClient.get(redisKey);

        if (cachedFood) {
            res.status(200).json(JSON.parse(cachedFood));
            return;
        }

        const response = await fetch(
            `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
        );
        const data = await response.json();

        // Check for "product not found" from the API
        if (data.status === 0 && data.status_verbose === "product not found") {
            // Log the issue for monitoring (optional)
            console.warn(`Product not found in OpenFoodFacts for barcode: ${barcode}`); 
            res.status(404).json({ status: "product not found" }); // Custom error response
            return;
        }

        // Cache only if the product was found
        await redisClient.set(redisKey, JSON.stringify(data), 'EX', 1200); // Cache for 20min

        res.status(200).json(data); 
    } catch (err) {
        res.status(500);
        throw new Error(err.message);
    }
});

module.exports = {
    getOpenFood
}