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

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    message: "API is healthy",
    status: "running",
    timestamp: new Date().toISOString(),
  });
});

// Get all products
router.get('/products', (req, res) => {
  handle(productRepository.findAll(), res);
});

// Get all basket configs
router.get('/baskets', (req, res) => {
  handle(basketConfigRepository.findAll(), res);
});

// Get all trolleys
router.get('/trolleys', (req, res) => {
  handle(trolleyRepository.findAll(), res);
});

// The huge nested data endpoint
router.get('/all-data', (req, res) => {
  handle(flightRepository.findAllWithDetails(), res);
});

// Endpoint to get a specific trolley by QR code
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