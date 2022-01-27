const db = require('../database');


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
            res.send(Response(false, 400, `${error.sqlMessage}`, error))
        };
        console.log("sales createred");

        const stockQuery = `select * from stock where productId = ${salesInput.productId}`;
        db.query(stockQuery, (error, stockdbResponse) => {
            if (error) throw error;
            console.log(salesdbResponse.length > 0);
            if (stockdbResponse.length > 0) {
                const date = new Date();
                const updateStockQuery = `update  stock set quantity = quantity - ${salesInput.quantity}, updatedOn = ? where stock.productId = ${salesInput.productId}`;
                db.query(updateStockQuery, [date],(error, dbResponse) => {
                    if (error) throw error;
                    console.log(salesInput.productId);
                    console.log("Stock data updated");
                });

            }
            
        });

        res.send(Response(true, 201, "Data Inserted into sales table ", salesdbResponse));
    });

};

module.exports = {createSales };