const express = require("express");
const requestLeaveController = require("../controllers/requestLeaveController");

const router = express.Router();

router.get("/leaveRequest", requestLeaveController.getLeaveRequests);
router.put("/update", requestLeaveController.updateLeaveRequest);

module.exports = router;
