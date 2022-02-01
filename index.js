require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');

const productRouter = require('./router/product');
const purchaseRouter = require('./router/purchase');
const salesRouter = require('./router/sales');
const stockQuantityRouter = require('./router/stockQuantity');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "5mb" }));


app.use('/product', productRouter);
app.use('/purchase', purchaseRouter);
app.use('/sales', salesRouter);
app.use('/stock', stockQuantityRouter)


const port = process.env.PORT;

app.listen(port, (error) => {
    if (error) throw error;
    console.log(`Server is running at ${port}`);
});


