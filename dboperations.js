var config = require('./dbconfig');
const sql = require('mssql');


async function checkUser(username, password) {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('username', sql.VarChar, username)
            .input('password', sql.VarChar, password)
            .execute('spCheckUser');
        return result.recordset.length > 0;
    } catch (error) {
        console.error('Error checking user:', error);
        throw error;
    }
}

//Displaying all users
async function getUsers(){
    try{
        let pool = await sql.connect(config);
        let users = await pool.request().execute("spDisplayAllUsers");
        return users.recordsets;
    }
    catch(error){
        console.log(error);
    }
}

//Get Specific User (Name)
async function getUserDetails(username, password){
    try{
        let pool = await sql.connect(config);
        let user = await pool.request()
            .input('username', sql.VarChar, username)
            .input('password', sql.VarChar, password)
            .query('SELECT * FROM tbUsers WHERE Username = @username and Password = @password');
        return user.recordset[0];
    }
    catch(error){
        console.log(error);
    }
}

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
        return product.recordset[0];
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
            .input('Name', sql.NVarChar, order.Name)
            .execute('spAddOrder');
        return insertOrder.recordsets;
    } 
    catch (error) {
        console.error('Error adding order:', error);
    }
}

//Register new user
async function registerNewAccount(user) {
    try {
        let pool = await sql.connect(config);

        let insertNewUser = await pool.request()
            .input('Name', sql.NVarChar, user.Name)
            .input('UserName', sql.NVarChar, user.Username)
            .input('Password', sql.NVarChar, user.Password)
            .execute('spRegisterNewUser');
        return insertNewUser.recordsets;
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

//edit order using stored proc
async function editOrder(data) {
    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input('id', sql.Int, data.id)
            .input('Title', sql.NVarChar, data.Title)
            .input('Quantity', sql.Int, data.Quantity)
            .input('Message', sql.NVarChar, data.Message)
            .input('City', sql.NVarChar, data.City)
            .input('EditedBy', sql.NVarChar, data.Name)
            .execute('spEditOrder');
        return result.rowsAffected[0];
    } catch (error) {
        console.error("Error updating order details:", error);
        throw error;
    }
}

module.exports = {
    checkUser,
    getUserDetails,
    getUsers,
    getOrders,
    getOrder,
    addOrder,
    deleteOrder,
    editOrder,
    registerNewAccount 
}