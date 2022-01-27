const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');

const productRouter = require('./router/product');
const purchaseRouter = require('./router/purchase');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "5mb" }));

app.use('/stock', productRouter);
app.use('/stock', purchaseRouter)

const Response = (success, statusCode, message, payload) => {
    return { success, statusCode, message, payload }
}
// console.log(Response(true, 200, "Inserted into database",{}));


app.post('/clients', (req, res) => {
    const ClientInput = {
        clientType: req.body.clientType,
        Name: req.body.Name,
        Phone_number: req.body.Phone_number,
        Email: req.body.Email,
        Address: req.body.Address
    }

    const clientQuery = " insert into Inventory.client set ?";
    db.query(clientQuery, ClientInput, (error, DbResponse) => {
        if (error) throw error;
        res.send(Response(true, 200, "Inserted into database", DbResponse))

    });
})

app.post('/stock', (req, res) => {
    const stockInput = {
        clientType: req.body.clientType,
        ProductName: req.body.ProductName,
        Quantity: req.body.Quantity,
        Price: req.body.Price,
        tax: req.body.tax,
        Product_Id: req.body.Product_Id
    }


    const stockQuery = " insert into Inventory.stock set ?";
    db.query(stockQuery, stockInput, (error, DbResponse) => {
        if (error) throw error;
        const message = "Stock data has been Inserted into database";
        res.send(Response(true, 200, message, DbResponse));

    });
});


app.post('/purchase', (req, res) => {
    const purchaseInput = {
        Id: req.body.Id,
        Name: req.body.Name,
        ProductName: req.body.ProductName,
        Product_Id: req.body.Product_Id,
        Quantity: req.body.Quantity,
        Price: req.body.Price
    }
    const purchaseQuery = "insert into Inventory.purchase set ?";
    db.query(purchaseQuery, purchaseInput, (error, DbResponse) => {
        if (error) throw error;

        const proId = req.body.Product_Id;

        const stockData = "select ProductName, Product_Id, Quantity from Inventory.stock where Product_Id = ?";
        // const stockData = "select stock.ProductName, stock.Product_Id, stock.Quantity from stock  join purchase on stock.Id = purchase.Id";
        db.query(stockData, proId, (error, DbResponse) => {
            if (error) throw error;
            console.log("Working select query by id no:");
            console.log(proId);
            console.log(DbResponse);
            const updatStockQuantity = DbResponse.map((Iteam) => {
                console.log(Iteam.Product_Id === proId);

                if (Iteam.Product_Id === proId) {


                    const totalQuantity = (Iteam.Quantity + purchaseInput.Quantity);
                    console.log(totalQuantity);
                    Iteam['Quantity'] = totalQuantity;
                    console.log(Iteam['Quantity']);

                    const updateStock = `update Inventory.stock set Quantity = ${totalQuantity} where Product_Id = ?`;
                    // const updateStock = "update stock, purchase set Quantity = (Quantity + purchaseInput.Quantity) where stock.Product_Id = ? "
                    db.query(updateStock, proId, (error, DbResponse) => {
                        if (error) throw error;
                        console.log("Stock Quantity updated");
                    })



                } else {
                    console.log("ID did not match to stock....");
                    // const stockInput = {
                    //     ProductName: req.body.ProductName,
                    //     Quantity: req.body.Quantity,
                    //     Price: req.body.Price,
                    //     Product_Id: req.body.Product_Id
                    // }
                    const stockQuery = " insert into Inventory.stock set ?";
                    db.query(stockQuery, purchaseInput, (error, DbResponse) => {
                        if (error) throw error;
                        console.log("ID did not match to stock");

                    });
                }
                return Iteam;

            })


        })

        // const stockInput = {
        //     ProductName: req.body.ProductName,
        //     Quantity: req.body.Quantity,
        //     Price: req.body.Price,
        //     Product_Id: req.body.Product_Id
        // }
        // const stockQuery = " insert into Inventory.stock set ?";
        // db.query(stockQuery, stockInput, (error, DbResponse) => {
        //     if (error) throw error;
        //     console.log("ID did not match to stock");

        // });
        // console.log(purchaseInput.Quantity);
        const message = "Purchase data has been Inserted into Database";
        res.send(Response(true, 200, message, DbResponse));
    });


});





app.post('/sales', (req, res) => {

    const salesInput = {
        Name: req.body.Name,
        Product_Id: req.body.Product_Id,
        ProductName: req.body.ProductName,
        Quantity: req.body.Quantity,
        Price: req.body.Price
    };

    const selesQuery = "insert into Sales set ?";
    db.query(selesQuery, salesInput, (error, DbResponse) => {
        if (error) throw error;

        const stockData = "select Product_Id, ProductName, Quantity from stock where Product_Id = ?";
        const proId = req.body.Product_Id;
        console.log(proId);
        db.query(stockData, proId, (error, DbResponse) => {
            if (error) throw error;
            console.log(DbResponse);
            const updatStockQuantity = DbResponse.map((Iteam) => {
                console.log(Iteam.Product_Id === proId);
                if (Iteam.Product_Id === proId) {
                    const reamingQuantity = (Iteam.Quantity - salesInput.Quantity);
                    console.log(" Reaming Quantity :" + reamingQuantity);
                    Iteam['reamingQuantity'] = reamingQuantity;
                    console.log(Iteam['reamingQuantity']);

                    const updateStock = `update Inventory.stock set as ReamingQuantity = ${reamingQuantity} where Product_Id = ? `;
                    // const updateStock = "update stock, purchase set Quantity = (Quantity + purchaseInput.Quantity) where stock.Product_Id = ? "
                    db.query(updateStock, proId, (error, DbResponse) => {
                        if (error) throw error;
                        console.log("Stock Quantity updated");
                    })

                }
                return Iteam;
            })
        })

        // console.log(stockInput.Product_Id);
        res.send("Sales data Inserted")

    })
})

const port = 8000;
app.listen(port, (error) => {
    if (error) throw error;
    console.log(`Server is running at ${port}`);
});