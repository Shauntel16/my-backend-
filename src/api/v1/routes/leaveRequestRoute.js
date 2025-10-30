const express = require("express");
const leaveRequestController = require("../controllers/leaveRequestController");
const uploadProof = require("../middlewares/uploadMiddleware");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();

// Create a new leave request (Student Assistant only - with optional proof file upload)
router.post(
  "/createLeaveRequest",
  authenticate('assistant'),
  uploadProof,
  leaveRequestController.createLeaveRequest
);

// Get all leave requests (Admin only)
router.get(
  "/displayLeaveRequests",
  authenticate('admin'),
  leaveRequestController.getLeaveRequests
);

// Get pending leave requests only (Admin only - for approve/decline)
router.get(
  "/pendingLeaveRequests",
  authenticate('admin'),
  leaveRequestController.getPendingLeaveRequests
);

// Get all leave requests for the authenticated student assistant
router.get(
  "/myLeaveRequests",
  authenticate('assistant'),
  leaveRequestController.getMyLeaveRequests
);

// Get a specific leave request by ID for the authenticated student assistant
router.get(
  "/myLeaveRequest/:leave_id",
  authenticate('assistant'),
  leaveRequestController.getMyLeaveRequestById
);

// Approve/Decline leave requests (Admin only)
router.put(
  "/updateLeaveRequest",
  authenticate('admin'),
  leaveRequestController.updateLeaveRequest
);

// Upload/Update proof file for existing leave request (Student Assistant only)
router.put(
  "/uploadProof/:leave_id",
  authenticate('assistant'),
  uploadProof,
  leaveRequestController.uploadProof
);

// Get leave requests for a specific student assistant (Admin only)
router.get(
  "/student/:studAssi_id",
  authenticate('admin'),
  leaveRequestController.getLeaveRequestsByStudentId
);

// Download/View proof file (Admin only)
router.get(
  "/proof/:leave_id",
  authenticate('admin'),
  leaveRequestController.getLeaveRequestProof
);

module.exports = router;
