const db = require('../database');
const commonResponse = require('../enum/enumobject');

const Response = (success, statusCode, message, payload) => {
    return { success, statusCode, message, payload }
}

const createSales = (req, res) =>{
    const salesInput = {
        Id: req.body.Id,
        name: req.body.name,
        productName: req.body.productName,
        quantity: req.body.quantity,
        productId: req.body.productId,
        price: req.body.price,
        salesOn: new Date()
    }

    const insertQuery = "Insert into sales set ?";
    db.query(insertQuery, salesInput, (error, salesdbResponse) => {
        if (error) {
            res.send(Response(false, commonResponse.errorCode, `${error.sqlMessage}`, error))
        };

        const stockQuery = `select * from stock where productId = ${salesInput.productId}`;
        db.query(stockQuery, (error, stockdbResponse) => {
            if (error) throw error;
         
            if (stockdbResponse.length > 0) {
                const date = new Date();
                const updateStockQuery = `update  stock set quantity = quantity - ${salesInput.quantity}, updatedOn = ? where stock.productId = ${salesInput.productId}`;
                db.query(updateStockQuery, [date],(error, dbResponse) => {
                    if (error) throw error;
                    console.log("Stock data updated");
                });

            }
            
        });

        res.send(Response(true, commonResponse.createCode, commonResponse.insertMessage, salesdbResponse));
    });

};

const findSales = (req, res) => {

    const salesQuery = "select * from sales where Id = ?";
    db.query(salesQuery, [req.params.Id], (error, dbResponse) => {
        if (error) throw error;
        console.log(dbResponse);
        if (dbResponse.length > 0) {
            res.send(Response(true, commonResponse.okCode, commonResponse.getMessage, dbResponse[0]));
        } else {
            res.send(Response(false, commonResponse.errorCode, commonResponse.invalidMessage, dbResponse[0]));
        }

    });

};

const sales = (req, res) => {

    const salesQuery = "select * from sales";
    db.query(salesQuery, (error, dbResponse) => {
        if (error) throw error;
        console.log(dbResponse);
        res.send(Response(true, commonResponse.okCode, commonResponse.getMessage, dbResponse));
    });

};

const updateSales = (req, res) => {

    const updateQuery = "update sales set name = ?, productId = ?, productName =?, quantity = ?, price = ? where Id = ?";
    const set = req.body;
    const date = new Date();
    const update = [set.name, set.productId, set.productName, set.quantity, set.price, date, req.params.Id]
    db.query(updateQuery, update, (error, dbResponse) => {
        if (error) throw error;
        res.send(Response(true, commonResponse.updateCode, commonResponse.updateMessage, dbResponse[0]));
    });

};

const deleteSales = (req, res) => {

    const salesQuery = "delete from sales where Id = ?";
    db.query(salesQuery, [req.params.Id], (error, dbResponse) => {
        if (error) throw error;
        res.send(Response(true, commonResponse.updateCode, commonResponse.deleteMessage, dbResponse));
    });

};

module.exports = {createSales, findSales, sales, updateSales, deleteSales};