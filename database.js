const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'Inventory'
});

connection.connect((error, data) => {
    if(error) throw error;
    console.log("Inventory DataBase has been connected");
})

module.exports = connection;