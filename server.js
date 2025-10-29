<<<<<<< HEAD
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
=======
const express = require("express");
const bodyParser = require("body-parser");

const addStudRoute = require("./src/api/v1/routes/addStudRoute");
const requestLeaveRoute = require("./src/api/v1/routes/requestLeaveRoute");
const reportClosureRoute = require("./src/api/v1/routes/reportClosureRoute");

const app = express();

app.use(bodyParser.json());

app.use(addStudRoute);
app.use(requestLeaveRoute);
app.use(reportClosureRoute);

app.get("/", (req, res, next) => {
  res.send("Home page reached");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
>>>>>>> origin/main
