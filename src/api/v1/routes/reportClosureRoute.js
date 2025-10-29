const express = require("express");
const reportClosureController = require("../controllers/reportClosureController");

const router = express.Router();

router.post("/reportDisruption", reportClosureController.createdDisruption);
router.get("/getDisruption", reportClosureController.getDiruptions);

module.exports = router;
