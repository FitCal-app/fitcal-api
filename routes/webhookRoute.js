const express = require('express');
const router = express.Router();
const { postWebhook } = require('../controller/webhookController')


router.post('/', postWebhook)


module.exports = router;