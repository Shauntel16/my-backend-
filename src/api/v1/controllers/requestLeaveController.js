const leaveRequests = [
  {
    id: "1",
    reason: "I am not feeling well",
    startDate: "25 Oct 2025",
    endDate: "30 Oct 2025",
    status: "pending",
  },
  {
    id: "2",
    reason: "Attending funeral",
    startDate: "17 Oct 2025",
    endDate: "19 Oct 2025",
    status: "pending",
  },
  {
    id: "3",
    reason: "Writing exam",
    startDate: "1 Nov 2025",
    endDate: "3 Nov 2025",
    status: "pending",
  },
  {
    id: "4",
    reason: "attending a hackathon",
    startDate: "5 Nov 2025",
    endDate: "7 Nov 2025",
    status: "pending",
  },
];

exports.getLeaveRequests = (req, res, next) => {
  res.send(leaveRequests);
};

exports.updateLeaveRequest = (req, res, next) => {
  const { id, status } = req.body;

  leaveRequests.forEach((element) => {
    if (element.id == id) {
      element.status = status;
    }
  });

  res.send(leaveRequests);
};
