const db = require('../database');
const commonResponse = require('../enum/enumobject');

const Response = (success, statusCode, message, payload) => {
    return { success, statusCode, message, payload }
}

const quantityCheck = (req, res ) =>{
    const quantityQuery = "select productName, quantity from stock where productId = ?";
     db.query(quantityQuery, [req.body.productId], (error, stockdbquantityResponse) =>{
         if (error) throw error;
         const stockdbQuantity = stockdbquantityResponse[0].quantity;
         console.log("Stock table:",stockdbQuantity);
         if (stockdbQuantity > 0) {
            res.send(Response(true, commonResponse.okCode, `Your Stock Avaliable Quantity is `, stockdbquantityResponse));
             
         } else {
            res.send(Response(true, commonResponse.okCode, "Sorry, Your Stock is not Avaliable ",stockdbquantityResponse));
         }
         
     });
};


module.exports = {quantityCheck}