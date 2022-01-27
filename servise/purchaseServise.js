const db = require('../database');

const Response = (success, statusCode, message, payload) => {
    return { success, statusCode, message, payload }
}

const createPurchase = (req, res) => {
    const purchaseInput = {
        Id: req.body.Id,
        name: req.body.name,
        productName: req.body.productName,
        quantity: req.body.quantity,
        productId: req.body.productId,
        price: req.body.price,
        createdOn: new Date()
    }

    const insertQuery = "Insert into purchase set ?";
    db.query(insertQuery, purchaseInput, (error, dbResponse) => {
        if (error) {
            res.send(Response(false, 400, `${error.sqlMessage}`, error))
        };

        const stockQuery = `select * from stock where productId = ${purchaseInput.productId}`;
        db.query(stockQuery, (error, stockdbResponse) => {
            if (error) throw error;
            console.log(stockdbResponse.length > 0);
            if (stockdbResponse.length > 0) {
                const updateStockQuery = `update  stock set quantity = quantity + ${purchaseInput.quantity} where stock.productId = ${purchaseInput.productId}`;
                db.query(updateStockQuery, (error, dbResponse) => {
                    if (error) throw error;
                    console.log(purchaseInput.productId);
                    console.log("Stock data updated");
                });

            } else {
                console.log("stock Insert process");
                const stockInput = {
                    name: req.body.name,
                    productName: req.body.productName,
                    quantity: req.body.quantity,
                    productId: req.body.productId,
                    createdOn: new Date()
                };

                const insertStockQuery = "insert into stock set ?";
                db.query(insertStockQuery, stockInput, (error, dbResponse) => {
                    if (error) throw error;
                    console.log("data are inserted into stock table");
                });
            }

        });

        res.send(Response(true, 201, "Data Inserted into purchase table ", dbResponse));
    });

};

findPurchase = (req, res) => {

    const purchaseQuery = "select * from purchase where Id = ?";
    db.query(purchaseQuery, [req.params.Id], (error, dbResponse) => {
        if (error) throw error;
        console.log(dbResponse);
        if (dbResponse.length > 0) {
            res.send(Response(true, 200, "Purchase data are...... ", dbResponse[0]));
        } else {
            res.send(Response(false, 400, "No data found! ", dbResponse[0]));
        }

    });

};

const purchases = (req, res) => {

    const purchaseQuery = "select * from purchase";
    db.query(purchaseQuery, (error, dbResponse) => {
        if (error) throw error;
        console.log(dbResponse);
        res.send(Response(true, 200, "Purchase data are...... ", dbResponse));
    });

};

const getAllPurchaseDetails = (req, res) => {
    const getAllDetails = "select name, product.productName, purchaseQuantity, price, product.brandName, product.productDescription from product  right join crud on product.productId = crud.product_Id";
    db.query(getAllDetails, (error, dbResponse) => {
        if (error) throw error;
        console.log(dbResponse);
        res.send(Response(true, 200, "All the products details are...... ", dbResponse));
    });
};

const updatePurchase = (req, res) => {

    const updateQuery = "update purchase set name = ?, productId = ?, productName =?, quantity = ?, price = ?, updatedOn = ? where Id = ?";
    const set = req.body;
    const date = new Date();
    const update = [set.name, set.productId, set.productName, set.quantity, set.price, date, req.params.Id]
    db.query(updateQuery, update, (error, dbResponse) => {
        if (error) throw error;
        res.send(Response(true, 202, "Data Updated into  table ", dbResponse[0]));
    });

};

const deletePruchase = (req, res) => {

    const deleteQuery = "delete from purchase where Id = ?";
    db.query(deleteQuery, [req.params.Id], (error, dbResponse) => {
        if (error) throw error;
        res.send(Response(true, 202, "Data Deleted from table ", dbResponse));
    });

};

module.exports = { createPurchase, purchases, getAllPurchaseDetails, findPurchase, updatePurchase, deletePruchase }