const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const app = express();
const port = process.env.PORT || 8080; // Use port from environment or default to 8080
const apiRoutes = require('./routes');

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Gategroup API',
      version: '1.0.0',
      description: 'API for the Gategroup Hackathon',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json());

app.use('/api', apiRoutes);

// Your "hello world" endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: "Hello world from the Gategroup API!",
    status: "running"
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Gategroup API listening on http://0.0.0.0:${port}`);
});
