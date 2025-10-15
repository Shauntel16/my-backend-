const express = require('express');
const authRoutes = require('./api/v1/routes/authRoutes');
const errorHandler = require('./utils/errorHandler');

const app = express();

app.use('/api/v1/auth', authRoutes);
//app.use('/api/v1/shifts', require(path.join(__dirname, 'src', 'api', 'v1', 'routes', 'shiftRoutes')));

app.use(errorHandler);

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
}

module.exports = app;
