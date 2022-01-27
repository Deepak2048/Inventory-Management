const express = require('express');
const router = express.Router();

const stockQuantityCheck = require('../servise/stockQuantityCheck');

router.get('/stockQuantity', stockQuantityCheck.quantityCheck)

module.exports = router;