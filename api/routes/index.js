const express = require('express');
const productRepository = require('../repositories/productRepository');

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

module.exports = router;