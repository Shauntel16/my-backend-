const express = require("express");
const reportDisruptionController = require("../controllers/reportDisruption.controller");

const router = express.Router();

router.post("/reportDisruption", reportDisruptionController.createdDisruption);
router.get("/getDisruptions", reportDisruptionController.getDisruptions);

module.exports = router;
