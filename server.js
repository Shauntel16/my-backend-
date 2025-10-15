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
