//This is required
var Db = require('./dboperations');
var Order = require('./order');
const dboperations = require('./dboperations');

//This is required
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var router = express.Router();

//This is used to clear the API
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use('/api', router);


//This method will be used frequently 
router.use((request, response, next) => {
    console.log('PostMan Request');
    next();
})  


// used to HTTP GET method for all the data
router.route('/orders').get((request, response) => {
    dboperations.getOrders().then(result => {
        response.json(result[0]);
    })
})

// used to get data by id
router.route('/orders/:id').get((request, response) => {
    dboperations.getOrder(request.params.id).then(result => {
        response.json(result[0]);
    })
})


// this is for routing the addOrder method
router.route('/orders').post((request, response) => {

    let order = { ...request.body };

    let result = dboperations.addOrder(order);
    response.status(201).json(result);

})


// delete order using id 
router.route("/orders/:id").delete((request, response) => {
    const { id } = request.params; // Get ID from URL

    dboperations.deleteOrder(id)
        .then(rowsDeleted => {
            if (rowsDeleted > 0) {
                response.status(200).json({ success: true, message: "User deleted successfully" });
            } else {
                response.status(404).json({ success: false, message: "User not found" });
            }
        })
        .catch(error => {
            console.error(error);
            response.status(500).json({ success: false, message: "Failed to delete user" });
        });
});

// Add new order
router.route('/orders').post(async (request, response) => {
    try {
        let order = { ...request.body };
        let result = await dboperations.addOrder(order);
        response.status(201).json(result);
    } catch (error) {
        console.error('Error adding order:', error);
        response.status(500).json({ success: false, message: 'Failed to add order' });
    }
});

//This is used to set PORT of the API
var port = process.env.PORT || 8080;
app.listen(port);
console.log('Order API is runnning at ' + port);

//This method will display JSON in console
dboperations.getOrders().then(result => {
    console.log(result);
})