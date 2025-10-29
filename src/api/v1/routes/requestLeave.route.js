const express = require("express");
const requestLeaveController = require("../controllers/requestLeave.controller");

const router = express.Router();

router.get("/displayLeaveRequests", requestLeaveController.getLeaveRequests);
router.put("/updateLeaveRequest", requestLeaveController.updateLeaveRequest);

module.exports = router;