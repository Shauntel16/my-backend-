const express = require("express");
const addStudController = require("../controllers/addStudController");

const router = express.Router();

router.get("/AddStud", addStudController.getStudAssistance);

router.post("/AddStud", addStudController.addStud);
router.get("/display", addStudController.displayStud);
router.put("/removeStud", addStudController.removeStudAssistance);

module.exports = router;
