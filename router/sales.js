const express = require('express');
// const bodyParser = require('body-parser');
const router = express.Router();

const salesServise = require('../servise/salesServise');

// router.use(bodyParser.urlencoded({extended:false}));
// router.use(bodyParser.json());

router.post('/sales', salesServise.createSales);

module.exports = router;



