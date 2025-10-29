const {
  getAllLeaveRequests,
  updateLeaveRequestById,
} = require("../../../services/requestLeave.service");

//Get all leave requests
exports.getLeaveRequests = async (req, res, next) => {
  const leaveRequests = await getAllLeaveRequests();
  res.json(leaveRequests);
};

//Approve/Decline leave requests
exports.updateLeaveRequest = async (req, res, next) => {
  const { leave_id, isGranted, reviewed_by } = req.body;

  const leaveRequest = await updateLeaveRequestById(
    leave_id,
    isGranted,
    reviewed_by
  );
  console.log(leaveRequest);
  res.send(`The leave request has been ${isGranted}`);
};