const express = require('express');
const router = express.Router();

const salesServise = require('../servise/salesServise');


router.post('/sales', salesServise.createSales);
router.get('/sales/:Id', salesServise.findSales);
router.get('/sales', salesServise.sales);
router.put('/sales/:Id', salesServise.updateSales );
router.delete('/sales/:Id', salesServise.deleteSales);

module.exports = router;



