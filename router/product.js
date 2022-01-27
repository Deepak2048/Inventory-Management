const express = require('express');
const router = express.Router();

const productServise = require('../servise/productServise')

router.post('/product', productServise.createProduct);

router.get('/product', productServise.products);

router.get('/product/:id', productServise.findProduct);

router.put('/product/:id', productServise.updateProduct);

router.delete('/product/:id', productServise.deleteProduct);


module.exports = router;