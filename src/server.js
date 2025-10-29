require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./api/v1/routes/authRoutes');
const errorHandler = require('./utils/errorHandler');
const leaveRequestRoute = require('./api/v1/routes/leaveRequestRoute');
const studentAssistantRoute = require('./api/v1/routes/studentAssistantRoute');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Authentication routes
app.use('/api/v1/auth', authRoutes);

// Leave request routes
app.use('/api/v1/leave-requests', leaveRequestRoute);

// Student assistant management routes
app.use('/api/v1/student-assistants', studentAssistantRoute);

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
