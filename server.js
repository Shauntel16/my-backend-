const express = require('express');
const path = require('path');
const authRoutes = require('./src/api/v1/routes/authRoutes');
const shiftRoutes = require('./src/api/v1/routes/shiftRoutes');
const errorHandler = require('./src/utils/errorHandler');
const shiftExchangeRoutes = require('./src/api/v1/routes/shiftExchangeRoutes');
const app = express();

app.use(express.json());


app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/shifts', shiftRoutes); 

app.use('/api/v1/shift-exchanges', shiftExchangeRoutes);
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Library backend running' });
});

app.use(errorHandler);


if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () =>
    console.log(`Server running on http://localhost:${port}`)
  );
}

module.exports = app;
