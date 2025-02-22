var config = require('./dbconfig');
const sql = require('mssql');

//Displaying all Orders
async function getOrders(){
    try{
        let pool = await sql.connect(config);
        let products = await pool.request().execute("spDisplayAllOrders");
        return products.recordsets;
    }
    catch(error){
        console.log(error);
    }
}

//Displaying Order by ID 
async function getOrder(orderId){
    try{
        let pool = await sql.connect(config);
        let product = await pool.request()
        .input('id', sql.Int, orderId)
        .execute('spDisplayOrderByID');
        return product.recordsets;
    }
    catch(error){
        console.log(error);
    }
}


//Adding new Order to the database
async function addOrder(order) {
    try {
        let pool = await sql.connect(config);

        let insertOrder = await pool.request()
            .input('Title', sql.NVarChar, order.Title)
            .input('Quantity', sql.Int, order.Quantity)
            .input('Message', sql.NVarChar, order.Message)
            .input('City', sql.NVarChar, order.City)
            .execute('spAddOrder');
        return insertOrder.recordsets;
    } 
    catch (error) {
        console.error('Error adding order:', error);
    }
}

//delete user using stored proc
async function deleteOrder(id) {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('id', sql.Int, parseInt(id)) // Ensure it's an integer
            .execute('spDeleteOrder');

        return result.rowsAffected[0]; // Ensure it correctly returns deleted rows
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
}

module.exports = {
    getOrders : getOrders,
    getOrder : getOrder,
    addOrder : addOrder,
    deleteOrder : deleteOrder
}