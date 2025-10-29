require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const requestLeaveRoute = require("./src/api/v1/routes/requestLeave.route");
const reportDisruptionRoute = require("./src/api/v1/routes/reportDisruption.route");
const locationRoute = require("./src/api/v1/routes/location.route");
const studentAssistantRoute = require("./src/api/v1/routes/studentAssistant.route");

const app = express();

app.use(bodyParser.json());

app.use(requestLeaveRoute);
app.use(reportDisruptionRoute);
app.use(locationRoute);
app.use(studentAssistantRoute);

app.get("/", (req, res, next) => {
  res.send("Home page reached");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
