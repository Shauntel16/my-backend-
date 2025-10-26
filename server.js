const express = require('express');
const path = require('path');
const authRoutes = require('./src/api/v1/routes/authRoutes');
const shiftRoutes = require('./src/api/v1/routes/shiftRoutes');
const errorHandler = require('./src/utils/errorHandler');
const shiftExchangeRoutes = require('./src/api/v1/routes/shiftExchangeRoutes');
const app = express();

// Parse incoming JSON
app.use(express.json());

// Mount routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/shifts', shiftRoutes); 

app.use('/api/v1/shift-exchanges', shiftExchangeRoutes);
// Health check route (optional)
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Library backend running' });
});

// Error handling middleware
app.use(errorHandler);

// Start server only if this file is run directly
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () =>
    console.log(`Server running on http://localhost:${port}`)
  );
}

module.exports = app;
