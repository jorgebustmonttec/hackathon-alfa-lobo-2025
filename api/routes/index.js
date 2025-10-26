const express = require('express');
const trolleyRepository = require('../repositories/trolleyRepository');
const productRepository = require('../repositories/productRepository');
const basketConfigRepository = require('../repositories/basketConfigRepository');
const flightRepository = require('../repositories/flightRepository');

const router = express.Router();

// Helper for consistent error/data responses
const handle = async (promise, res) => {
  try {
    const data = await promise;
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// --- Endpoints ---

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     responses:
 *       200:
 *         description: API is healthy
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    message: "API is healthy",
    status: "running",
    timestamp: new Date().toISOString(),
  });
});

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     responses:
 *       200:
 *         description: A list of products
 */
router.get('/products', (req, res) => {
  handle(productRepository.findAll(), res);
});

/**
 * @swagger
 * /baskets:
 *   get:
 *     summary: Get all basket configs
 *     responses:
 *       200:
 *         description: A list of basket configs
 */
router.get('/baskets', (req, res) => {
  handle(basketConfigRepository.findAll(), res);
});

/**
 * @swagger
 * /trolleys:
 *   get:
 *     summary: Get all trolleys
 *     responses:
 *       200:
 *         description: A list of trolleys
 */
router.get('/trolleys', (req, res) => {
  handle(trolleyRepository.findAll(), res);
});

/**
 * @swagger
 * /all-data:
 *   get:
 *     summary: The huge nested data endpoint
 *     responses:
 *       200:
 *         description: All data, nested
 */
router.get('/all-data', (req, res) => {
  handle(flightRepository.findAllWithDetails(), res);
});

/**
 * @swagger
 * /trolley/{qrId}:
 *   get:
 *     summary: Get a specific trolley by QR code
 *     parameters:
 *       - in: path
 *         name: qrId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The trolley object
 *       404:
 *         description: Trolley not found
 */
router.get('/trolley/:qrId', async (req, res) => {
  const { qrId } = req.params;
  if (!qrId) {
    return res.status(400).json({ error: 'QR ID is required' });
  }
  const trolley = await trolleyRepository.findByQrId(qrId);
  if (!trolley) {
    return res.status(404).json({ error: `Trolley with QR ID ${qrId} not found` });
  }
  res.status(200).json(trolley);
});

module.exports = router;