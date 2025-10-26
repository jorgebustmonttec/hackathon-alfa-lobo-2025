// api/index.js
const express = require('express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors'); // Import cors
const apiRoutes = require('./routes');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// --- Swagger Setup ---
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Gategroup API',
      version: '1.0.0',
      description: 'A minimal, working API.',
    },
    servers: [
      {
        url: `http://localhost:${port}/api`, // Corrected: Added /api prefix
        description: 'Development Server'
      },
    ],
  },
  apis: ['./routes/*.js'],
};
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// --- Routes ---
app.use('/api', apiRoutes);

// --- Server ---
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Gategroup API listening on http://0.0.0.0:${port}`);
  console.log(`📚 API Docs available at http://localhost:${port}/api-docs`);
});