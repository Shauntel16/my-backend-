const express = require("express");
const locationController = require("../controllers/location.controller");

const router = express.Router();

router.post("/addLocation", locationController.addLocation);

module.exports = router;
