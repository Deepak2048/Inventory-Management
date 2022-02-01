
const db = require('../database');
const commonResponse = require('../enum/enumobject');

const response = (success, statusCode, message, payload) => {
    return { success, statusCode, message, payload };
}

const createProduct = (req, res) =>{
    const productInput = {
        id: req.body.id,
        productId: req.body.productId,
        productName: req.body.productName,
        brandName: req.body.brandName,
        productDescription: req.body.productDescription
    };
    
    const insertQauery = "insert into product set ?";
    db.query(insertQauery, productInput, (error, dbResponse) =>{
        if (error) {
            return res.json(response(false, commonResponse.notfoundCode, commonResponse.invalidMessage, error))
        }
        res.send(response(true, commonResponse.createCode, commonResponse.insertMessage, dbResponse));

    });
   
};


const products = (req, res) => {

    const producteQuery = "select * from product ";
    db.query(producteQuery, (error, dbResponse) => {
        if(error) throw error;
        console.log(dbResponse);
        res.send(response(true, commonResponse.okCode, commonResponse.getMessage, dbResponse));
    });

};


const findProduct = (req, res) => {
   
    const producteQuery = "select * from product where id = ?";
    db.query(producteQuery, [parseInt(req.params.id)], (error, dbResponse) => {
        if(error) throw error;
        console.log(dbResponse);
        res.send(response(true, commonResponse.okCode, commonResponse.getMessage, dbResponse[0]));
    });

};

const updateProduct = (req, res) =>{
    const updateQuery = "update product set productId = ?, productName = ?, brandName =?, productDescription = ? where id = ? ";
    const setData = req.body;
    const update = [setData.productId, setData.productName, setData.brandName, setData.productDescription, req.params.id];
    db.query(updateQuery, update, (error, dbResponse) =>{
        if (error) {
            return res.send(response(false, commonResponse.notfoundCode, commonResponse.invalidMessage, error))            
        }
        res.send(response(true, commonResponse.updateCode, commonResponse.updateMessage, dbResponse[0]))
    });
};

const deleteProduct = (req, res) =>{

    const deleteQuery = "delete from product where Id = ?";
    db.query(deleteQuery, [req.params.id], (error, dbResponse) =>{
        if (error) {
            return res.send(response(false, commonResponse.notfoundCode,  commonResponse.insertMessage, error))            
        }
        res.send(response(true, commonResponse.updateCode, commonResponse.deleteMessage, dbResponse[0]))
    });

};

module.exports = {createProduct, products, findProduct, updateProduct, deleteProduct};