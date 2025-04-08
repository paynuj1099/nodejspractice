// Required modules
const dboperations = require('./dboperations');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const router = express.Router();

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Practice',
            version: '1.0.0',
            description: 'API documentation for API Practice',
        },
        servers: [
            {
                url: 'http://localhost:8080/api'

            },
            {
                url: 'http://172.26.220.202:8080/api'
            },
        ],
    },
    apis: ['./api.js'], // Path to your API file for annotations
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-jun', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use('/api', router);

router.use((request, response, next) => {
    console.log('Middleware triggered');
    next();
});

// ---- GET ROUTES ---- //

/**
 * @swagger
 * tags:
 *   name: GET
 *   description: Endpoints for retrieving data
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     tags:
 *       - GET
 *     summary: Retrieve a list of orders
 *     responses:
 *       200:
 *         description: A list of orders
 */
router.route('/orders').get((request, response) => {
    dboperations.getOrders().then(result => {
        response.json(result[0]);
    });
});

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     tags:
 *       - GET
 *     summary: Retrieve a single order by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the order to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single order
 *       404:
 *         description: Order not found
 */
router.route('/orders/:id').get((request, response) => {
    try{
        dboperations.getOrder(request.params.id).then(result => {
            response.status(200).json(result);
        });
    }
    catch{
        response.status(404).json({ success: false, message: 'Order not found' });
    }
});

/**
 * @swagger
 * /registration:
 *   get:
 *     tags:
 *       - GET
 *     summary: Retrieve all registered users
 *     responses:
 *       200:
 *         description: A list of registered users
 */
router.route('/registration').get((request, response) => {
    dboperations.getUsers().then(result => {
        response.json(result[0]);
    });
});

// ---- POST ROUTES ---- //

/**
 * @swagger
 * tags:
 *   name: POST
 *   description: Endpoints for creating or updating data
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     tags:
 *       - POST
 *     summary: Add a new order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Title:
 *                 type: string
 *               Quantity:
 *                 type: integer
 *               Message:
 *                 type: string
 *               City:
 *                 type: string
 *               Name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Order added successfully
 *       500:
 *         description: Failed to add order
 */
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

/**
 * @swagger
 * /orderEdit:
 *   post:
 *     tags:
 *       - POST
 *     summary: Edit an order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               Title:
 *                 type: string
 *               Quantity:
 *                 type: integer
 *               Message:
 *                 type: string
 *               City:
 *                 type: string
 *               Name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       404:
 *         description: Order not found
 */
router.route('/orderEdit').post(async (request, response) => {
    try {
        let data = { ...request.body };
        let result = await dboperations.editOrder(data);
        if (result > 0) {
            response.status(200).json({ success: true, message: 'Order updated successfully' });
        } else {
            response.status(404).json({ success: false, message: 'Order not found' });
        }
    } catch (error) {
        console.error('Error updating order details:', error);
        response.status(500).json({ success: false, message: 'Failed to update order details' });
    }
});

/**
 * @swagger
 * /registration:
 *   post:
 *     tags:
 *       - POST
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *               Username:
 *                 type: string
 *               Password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       500:
 *         description: Failed to register user
 */
router.route('/registration').post(async (request, response) => {
    try {
        let user = { ...request.body };
        let result = await dboperations.registerNewAccount(user);
        response.status(201).json(result);
    } catch (error) {
        console.error('Error adding new user:', error);
        response.status(500).json({ success: false, message: 'Failed to add new user' });
    }
});

/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - POST
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.route('/login').post(async (request, response) => {
    try {
        let { username, password } = request.body;
        let result = await dboperations.checkUser(username, password);
        if (result) {
            response.status(200).json({ success: true, message: 'Login successful' });
        } else {
            response.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        response.status(500).json({ success: false, message: 'Failed to login' });
    }
});

/**
 * @swagger
 * /userdetails:
 *   post:
 *     tags:
 *       - POST
 *     summary: Get user details
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *       404:
 *         description: User not found
 */
router.route('/userdetails').post(async (request, response) => {
    try {
        let { username, password } = request.body;
        let userDetails = await dboperations.getUserDetails(username, password);
        if (userDetails) {
            response.status(200).json(userDetails);
        } else {
            response.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user details:', error);
        response.status(500).json({ success: false, message: 'Failed to fetch user details' });
    }
});

// ---- DELETE ROUTES ---- //

/**
 * @swagger
 * tags:
 *   name: DELETE
 *   description: Endpoints for deleting data
 */

/**
 * @swagger
 * /orderDelete/{id}:
 *   delete:
 *     tags:
 *       - DELETE
 *     summary: Delete an order by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the order to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 */
router.route("/orderDelete/:id").delete((request, response) => {
    const { id } = request.params;

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

// ---- SERVER CONFIGURATION ---- //

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`API is running at ${port}`);
});