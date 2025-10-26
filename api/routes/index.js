const express = require('express');
const productRepository = require('../repositories/productRepository');
const trolleyRepository = require('../repositories/trolleyRepository');
const configurationRepository = require('../repositories/configurationRepository');
const flightRepository = require('../repositories/flightRepository');
const replenishmentRepository = require('../repositories/replenishmentRepository');
const userRepository = require('../repositories/userRepository');

const router = express.Router();

// The userAuth middleware is no longer needed for the log endpoint.
// I am removing it to simplify the code.

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health Check
 *     description: Checks if the API is running and responsive.
 *     responses:
 *       200:
 *         description: API is healthy.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: running
 */
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'running' });
});

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get All Products
 *     description: Retrieves a list of all products from the database.
 *     responses:
 *       200:
 *         description: A list of products.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   product_id:
 *                     type: string
 *                     format: uuid
 *                   name:
 *                     type: string
 *                   barcode:
 *                     type: string
 *       500:
 *         description: Internal server error.
 */
router.get('/products', async (req, res) => {
  try {
    const products = await productRepository.findAll();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

/**
 * @swagger
 * /trolleys:
 *   get:
 *     summary: Get All Trolleys
 *     description: Retrieves a list of all trolleys with their basic information, useful for testing.
 *     tags: [Trolleys]
 *     responses:
 *       200:
 *         description: A list of trolleys.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   trolley_id:
 *                     type: string
 *                     format: uuid
 *                   trolley_qr_id:
 *                     type: string
 *                   flight_route_id:
 *                     type: string
 *                     format: uuid
 *             example:
 *               - trolley_id: "b1b1b1b1-1111-1111-1111-000000000001"
 *                 trolley_qr_id: "GATE-TROLLEY-001"
 *                 flight_route_id: "d1d1d1d1-4444-4444-4444-000000000001"
 *               - trolley_id: "b1b1b1b1-1111-1111-1111-000000000002"
 *                 trolley_qr_id: "GATE-TROLLEY-002"
 *                 flight_route_id: "d1d1d1d1-4444-4444-4444-000000000001"
 *       500:
 *         description: Internal server error.
 */
router.get('/trolleys', async (req, res) => {
  try {
    const trolleys = await trolleyRepository.findAll();
    res.status(200).json(trolleys);
  } catch (error) {
    console.error('Error fetching trolleys:', error);
    res.status(500).json({ error: 'Failed to fetch trolleys' });
  }
});

/**
 * @swagger
 * /trolley/{qrId}/flight:
 *   get:
 *     summary: Get Flight Info by Trolley QR ID
 *     description: After scanning a trolley's QR code, the app sends the ID to get basic flight information.
 *     tags: [Trolley Workflow]
 *     parameters:
 *       - in: path
 *         name: qrId
 *         required: true
 *         schema:
 *           type: string
 *           example: "GATE-TROLLEY-001"
 *         description: The unique QR ID of the trolley.
 *     responses:
 *       200:
 *         description: Flight information associated with the trolley.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 flight_route_id:
 *                   type: string
 *                   format: uuid
 *                 route_number:
 *                   type: string
 *                 origin:
 *                   type: string
 *                 destination:
 *                   type: string
 *             example:
 *               flight_route_id: "d1d1d1d1-4444-4444-4444-000000000001"
 *               route_number: "AA123"
 *               origin: "DFW"
 *               destination: "LHR"
 *       404:
 *         description: Trolley not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/trolley/:qrId/flight', async (req, res) => {
  try {
    const { qrId } = req.params;
    const trolleyData = await trolleyRepository.findByQrIdWithFlight(qrId);

    if (!trolleyData) {
      return res.status(404).json({ error: `Trolley with QR ID '${qrId}' not found.` });
    }

    // Respond with only the flight-specific data
    res.status(200).json({
      flight_route_id: trolleyData.flight_route_id,
      route_number: trolleyData.route_number,
      origin: trolleyData.origin,
      destination: trolleyData.destination,
    });
  } catch (error) {
    console.error(`Error fetching flight info for trolley QR '${req.params.qrId}':`, error);
    res.status(500).json({ error: 'Failed to fetch flight information.' });
  }
});

/**
 * @swagger
 * /trolley/{qrId}/config:
 *   get:
 *     summary: Get Directional Trolley Config
 *     description: After the user selects their current location, the API returns the correct detailed trolley configuration for the upcoming flight leg.
 *     tags: [Trolley Workflow]
 *     parameters:
 *       - in: path
 *         name: qrId
 *         required: true
 *         schema:
 *           type: string
 *           example: "GATE-TROLLEY-001"
 *         description: The unique QR ID of the trolley.
 *       - in: query
 *         name: location
 *         required: true
 *         schema:
 *           type: string
 *           example: "DFW"
 *         description: The IATA code of the airport the user is currently at.
 *     responses:
 *       200:
 *         description: The detailed trolley configuration for the specified direction.
 *       400:
 *         description: Invalid request, e.g., location does not match origin or destination.
 *       404:
 *         description: Trolley not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/trolley/:qrId/config', async (req, res) => {
  try {
    const { qrId } = req.params;
    const { location } = req.query;

    if (!location) {
      return res.status(400).json({ error: "Query parameter 'location' is required." });
    }

    const trolley = await trolleyRepository.findByQrIdWithFlight(qrId);

    if (!trolley) {
      return res.status(404).json({ error: `Trolley with QR ID '${qrId}' not found.` });
    }

    let configId;
    if (location.toUpperCase() === trolley.origin) {
      configId = trolley.origin_trolley_config_id;
    } else if (location.toUpperCase() === trolley.destination) {
      configId = trolley.destination_trolley_config_id;
    } else {
      return res.status(400).json({ error: `Invalid location '${location}'. Must be either origin '${trolley.origin}' or destination '${trolley.destination}'.` });
    }

    const config = await configurationRepository.findFullTrolleyConfigById(configId);
    res.status(200).json(config);

  } catch (error) {
    console.error(`Error fetching config for trolley QR '${req.params.qrId}':`, error);
    res.status(500).json({ error: 'Failed to fetch trolley configuration.' });
  }
});

/**
 * @swagger
 * /all-data:
 *   get:
 *     summary: Get All Nested Data (For Debugging)
 *     description: A convenience endpoint to get all flight, trolley, and product configuration data in a single, deeply nested JSON object.
 *     tags: [Debug]
 *     responses:
 *       200:
 *         description: All data, nested.
 *       500:
 *         description: Internal server error.
 */
router.get('/all-data', async (req, res) => {
  try {
    const allData = await flightRepository.findAllWithDetails();
    res.status(200).json(allData);
  } catch (error) {
    console.error('Error fetching all data:', error);
    res.status(500).json({ error: 'Failed to fetch all data.' });
  }
});

/**
 * @swagger
 * /replenishment/log:
 *   post:
 *     summary: Create Replenishment Log
 *     description: After finishing the replenishment process, the app sends the complete log to be stored. The API calculates the completion time.
 *     tags: [Trolley Workflow]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the person submitting the log.
 *               trolley_qr_id:
 *                 type: string
 *                 description: The QR ID of the trolley that was serviced.
 *               location_code:
 *                 type: string
 *                 description: The IATA code of the airport where the service occurred.
 *               started_at:
 *                 type: string
 *                 format: date-time
 *                 description: The ISO 8601 timestamp of when the user started the process.
 *               details:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product_id:
 *                       type: string
 *                       format: uuid
 *                     position_identifier:
 *                       type: string
 *                     expected_quantity:
 *                       type: integer
 *                     counted_quantity:
 *                       type: integer
 *           example:
 *             username: "testuser"
 *             trolley_qr_id: "GATE-TROLLEY-001"
 *             location_code: "DFW"
 *             started_at: "2025-10-26T18:30:00Z"
 *             details:
 *               - product_id: "a1a1a1a1-1111-1111-1111-000000000001"
 *                 position_identifier: "A1"
 *                 expected_quantity: 40
 *                 counted_quantity: 38
 *     responses:
 *       201:
 *         description: Log created successfully.
 *       400:
 *         description: Bad request, e.g., missing data, invalid username, or invalid trolley.
 */
router.post('/replenishment/log', async (req, res) => {
  try {
    const { username, trolley_qr_id, location_code, started_at, details } = req.body;

    if (!username || !trolley_qr_id || !location_code || !started_at || !details || !Array.isArray(details)) {
      return res.status(400).json({ error: 'Missing required fields: username, trolley_qr_id, location_code, started_at, and details array.' });
    }

    const user = await userRepository.findByUsername(username);
    if (!user) {
      return res.status(400).json({ error: `User with username '${username}' not found.` });
    }

    const trolley = await trolleyRepository.findByQrIdWithFlight(trolley_qr_id);
    if (!trolley) {
      return res.status(400).json({ error: `Trolley with QR ID '${trolley_qr_id}' not found.` });
    }

    const logData = {
      trolley_id: trolley.trolley_id,
      user_id: user.user_id,
      flight_route_id: trolley.flight_route_id,
      location_code,
      started_at,
      details,
    };

    const result = await replenishmentRepository.createLog(logData);
    res.status(201).json(result);

  } catch (error) {
    console.error('Error creating replenishment log:', error);
    res.status(500).json({ error: 'Failed to create replenishment log.' });
  }
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get All Users
 *     description: Retrieves a list of all users in the system.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users.
 */
router.get('/users', async (req, res) => {
  try {
    const users = await userRepository.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

/**
 * @swagger
 * /logs:
 *   get:
 *     summary: Get All Replenishment Logs
 *     description: Retrieves a summary of all replenishment logs.
 *     tags: [Logs]
 *     responses:
 *       200:
 *         description: A list of log summaries.
 */
router.get('/logs', async (req, res) => {
  try {
    const logs = await replenishmentRepository.findAllLogs();
    res.status(200).json(logs);
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ error: 'Failed to fetch logs.' });
  }
});

/**
 * @swagger
 * /logs/user/{userId}:
 *   get:
 *     summary: Get Logs by User
 *     description: Retrieves all replenishment logs submitted by a specific user.
 *     tags: [Logs]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: A list of log summaries for the specified user.
 */
router.get('/logs/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const logs = await replenishmentRepository.findLogsByUserId(userId);
    res.status(200).json(logs);
  } catch (error) {
    console.error(`Error fetching logs for user ${req.params.userId}:`, error);
    res.status(500).json({ error: 'Failed to fetch user logs.' });
  }
});

module.exports = router;