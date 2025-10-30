const {
  getAllLeaveRequests,
  getPendingLeaveRequests,
  createLeaveRequest,
  getLeaveRequestsByStudentAssistant,
  getLeaveRequestById,
  updateLeaveRequestById,
  getLeaveRequestProofById,
  updateLeaveRequestProof,
} = require("../../../services/leaveRequestService");

// Create a new leave request (Student Assistant only - uses their own ID from token)
exports.createLeaveRequest = async (req, res, next) => {
  try {
    // Get student assistant ID from authenticated user
    const studAssi_id = req.user.id; // From authentication middleware
    const { reviewed_by, reason, start_Date, end_date, leave_type } = req.body;

    // Validate required fields (studAssi_id is from token, reviewed_by is optional)
    if (!reason || !start_Date || !end_date || !leave_type) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: reason, start_Date, end_date, leave_type",
      });
    }

    // Validate leave_type enum
    const validLeaveTypes = ["SICK", "MATERNITY_LEAVE", "FAMILY_RESPONSIBILITY"];
    if (!validLeaveTypes.includes(leave_type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid leave_type. Must be one of: SICK, MATERNITY_LEAVE, FAMILY_RESPONSIBILITY",
      });
    }

    // Get file data if uploaded
    const proof_file_content = req.file ? req.file.buffer : null;
    const proof_file_type = req.file ? req.file.mimetype : null;
    const proof_file_name = req.file ? req.file.originalname : null;

    const leaveRequestData = {
      studAssi_id: parseInt(studAssi_id),
      reviewed_by: reviewed_by ? parseInt(reviewed_by) : null,
      reason,
      start_Date,
      end_date,
      leave_type,
      proof_file_content,
      proof_file_type,
      proof_file_name,
    };

    const leaveRequest = await createLeaveRequest(leaveRequestData);

    const proofStatus = req.file 
      ? `Proof file "${req.file.originalname}" uploaded successfully` 
      : "No proof file provided";

    res.status(201).json({
      success: true,
      message: "Leave request created successfully",
      proof_upload: proofStatus,
      data: {
        ...leaveRequest,
        proof_uploaded: !!req.file,
        proof_file_size: req.file ? req.file.size : null,
      },
    });
  } catch (error) {
    console.error("Error creating leave request:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error creating leave request",
    });
  }
};

// Get leave requests for a specific student assistant (Admin only)
exports.getLeaveRequestsByStudentId = async (req, res, next) => {
  try {
    const { studAssi_id } = req.params;

    if (!studAssi_id) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameter: studAssi_id",
      });
    }

    const leaveRequests = await getLeaveRequestsByStudentAssistant(studAssi_id);

    res.json({
      success: true,
      message: "Leave requests retrieved successfully",
      data: leaveRequests,
      count: leaveRequests.length,
    });
  } catch (error) {
    console.error("Error fetching leave requests:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching leave requests",
    });
  }
};

// Get all leave requests (Admin only)
exports.getLeaveRequests = async (req, res, next) => {
  try {
    const leaveRequests = await getAllLeaveRequests();
    res.json({
      success: true,
      data: leaveRequests,
      count: leaveRequests.length,
    });
  } catch (error) {
    console.error("Error fetching leave requests:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching leave requests",
    });
  }
};

// Get pending leave requests only (Admin only - for approve/decline)
exports.getPendingLeaveRequests = async (req, res, next) => {
  try {
    const leaveRequests = await getPendingLeaveRequests();
    res.json({
      success: true,
      message: `Retrieved ${leaveRequests.length} pending leave request(s)`,
      data: leaveRequests,
      count: leaveRequests.length,
    });
  } catch (error) {
    console.error("Error fetching pending leave requests:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching pending leave requests",
    });
  }
};

// Get all leave requests for the authenticated student assistant
exports.getMyLeaveRequests = async (req, res, next) => {
  try {
    // Get student assistant ID from authenticated user
    const studAssi_id = req.user.id; // From authentication middleware

    const leaveRequests = await getLeaveRequestsByStudentAssistant(studAssi_id);

    res.json({
      success: true,
      message: "Leave requests retrieved successfully",
      data: leaveRequests,
      count: leaveRequests.length,
    });
  } catch (error) {
    console.error("Error fetching leave requests:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching leave requests",
    });
  }
};

// Get a specific leave request by ID for the authenticated student assistant
exports.getMyLeaveRequestById = async (req, res, next) => {
  try {
    const { leave_id } = req.params;
    // Get student assistant ID from authenticated user
    const studAssi_id = req.user.id; // From authentication middleware

    if (!leave_id) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameter: leave_id",
      });
    }

    // Ensure the leave request belongs to this student assistant
    const leaveRequest = await getLeaveRequestById(leave_id, studAssi_id);

    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found or you don't have access to it",
      });
    }

    res.json({
      success: true,
      message: "Leave request retrieved successfully",
      data: leaveRequest,
    });
  } catch (error) {
    console.error("Error fetching leave request:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching leave request",
    });
  }
};

// Approve/Decline leave requests (Admin only - uses admin ID from token)
exports.updateLeaveRequest = async (req, res, next) => {
  try {
    // Get admin ID from authenticated user
    const reviewed_by = req.user.id; // From authentication middleware
    const { leave_id, isGranted } = req.body;

    if (!leave_id || !isGranted) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: leave_id, isGranted",
      });
    }

    // Validate isGranted enum
    const validStatuses = ["PENDING", "APPROVED", "DECLINED"];
    if (!validStatuses.includes(isGranted)) {
      return res.status(400).json({
        success: false,
        message: "Invalid isGranted. Must be one of: PENDING, APPROVED, DECLINED",
      });
    }

    const leaveRequest = await updateLeaveRequestById(
      parseInt(leave_id),
      isGranted,
      parseInt(reviewed_by)
    );
    
    res.json({
      success: true,
      message: `The leave request has been ${isGranted}`,
      data: leaveRequest,
    });
  } catch (error) {
    console.error("Error updating leave request:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error updating leave request",
    });
  }
};

// Upload/Update proof file for leave request (Student Assistant only)
exports.uploadProof = async (req, res, next) => {
  try {
    const { leave_id } = req.params;
    // Get student assistant ID from authenticated user
    const studAssi_id = req.user.id;

    if (!leave_id) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameter: leave_id",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No proof file provided",
      });
    }

    const proof_file_content = req.file.buffer;
    const proof_file_type = req.file.mimetype;
    const proof_file_name = req.file.originalname;

    const leaveRequest = await updateLeaveRequestProof(
      leave_id,
      studAssi_id,
      proof_file_content,
      proof_file_type,
      proof_file_name
    );

    res.json({
      success: true,
      message: `Proof file "${proof_file_name}" uploaded successfully`,
      data: {
        ...leaveRequest,
        proof_uploaded: true,
        proof_file_size: req.file.size,
      },
    });
  } catch (error) {
    console.error("Error uploading proof file:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error uploading proof file",
    });
  }
};

// Download/View proof file (Admin only)
exports.getLeaveRequestProof = async (req, res, next) => {
  try {
    const { leave_id } = req.params;

    if (!leave_id) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameter: leave_id",
      });
    }

    const leaveRequest = await getLeaveRequestProofById(leave_id);

    if (!leaveRequest) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found",
      });
    }

    if (!leaveRequest.proof_file_content) {
      return res.status(404).json({
        success: false,
        message: "No proof file available for this leave request",
      });
    }

    // Set appropriate headers for file download/viewing
    const contentType = leaveRequest.proof_file_type || 'application/octet-stream';
    const defaultFileName = leaveRequest.proof_file_name || `proof_${leave_id}`;
    // Allow admin to override suggested filename and disposition via query
    const requestedFileName = (req.query && req.query.filename) ? String(req.query.filename) : defaultFileName;
    const disposition = (req.query && req.query.disposition) ? String(req.query.disposition).toLowerCase() : 'attachment';
    const safeDisposition = disposition === 'inline' ? 'inline' : 'attachment';

    // Basic filename sanitization for header safety
    const safeFileName = requestedFileName.replace(/[\r\n\0]/g, '').replace(/"/g, '');

    res.setHeader('Content-Type', contentType);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Disposition', `${safeDisposition}; filename="${safeFileName}"`);
    res.setHeader('Content-Length', leaveRequest.proof_file_content.length);

    // Send the file content
    res.send(Buffer.from(leaveRequest.proof_file_content));
  } catch (error) {
    console.error("Error fetching proof file:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching proof file",
    });
  }
};
