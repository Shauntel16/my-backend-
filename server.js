const express = require("express");
const addStudRoute = require("./src/api/v1/routes/addStudRoute");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

app.use(addStudRoute);

app.get("/", (req, res, next) => {
  res.send("Home page reached");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
