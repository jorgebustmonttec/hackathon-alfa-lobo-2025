// api/index.js
const express = require('express');
const app = express();
const port = process.env.PORT || 8080; // Use port from environment or default to 8080

app.use(express.json());

// Your "hello world" endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: "Hello world from the Gategroup API!",
    status: "running"
  });
});

// A test endpoint for your database
app.get('/test', (req, res) => {
  // In the future, you'd query your 'test_table' here
  res.status(200).json([
    { id: 1, name: "name" }
  ]);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Gategroup API listening on http://0.0.0.0:${port}`);
});