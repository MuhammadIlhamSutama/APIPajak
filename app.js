// index.js
const express = require('express');
const cors = require('cors');
const { handleTaxCalculationUnder2025, handleTaxCalculation2025, handleProgressiveTax } = require('./handle');
const { errorHandler, notFoundHandler } = require('./error');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Routes
app.post('/calculate-under2025', handleTaxCalculationUnder2025);
app.post('/calculate-2025', handleTaxCalculation2025);
app.post('/calculate-pembukuan-progresif', handleProgressiveTax);

// Middleware untuk menangani rute yang tidak ditemukan
app.use(notFoundHandler);

// Middleware global untuk menangani error
app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
