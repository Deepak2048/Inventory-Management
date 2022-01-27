const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const purchaseServise = require('../servise/purchaseServise');

router.use(bodyParser.urlencoded({extended:false}));
router.use(bodyParser.json());

router.post('/purchase', purchaseServise.createPurchase);

router.get('/purchase', purchaseServise.purchases );

router.get('/purchaseDetails', purchaseServise.getAllPurchaseDetails);

router.get('/purchase/:Id', purchaseServise.findPurchase);

router.put('/purchase/:Id', purchaseServise.updatePurchase);

router.delete('/purchase/:Id', purchaseServise.deletePruchase);


module.exports = router;