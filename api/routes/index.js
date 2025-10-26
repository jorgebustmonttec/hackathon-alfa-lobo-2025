const express = require('express');
const productRepository = require('../repositories/productRepository');
const trolleyRepository = require('../repositories/trolleyRepository');

const router = express.Router();

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

module.exports = router;