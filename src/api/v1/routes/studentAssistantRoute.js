const express = require("express");
const router = express.Router();
const studentAssistantController = require("../controllers/studentAssistantController");
const authenticate = require("../middlewares/authenticate");

// Create student assistant - Admin only
router.post(
  "/addStudentAssistant",
  authenticate('admin'),
  studentAssistantController.addStudentAssistant
);

// View all student assistants - Admin only
router.get(
  "/displayAllStudentAssistants",
  authenticate('admin'),
  studentAssistantController.displayAllStudentAssistants
);

// View student assistant by email - Admin only
router.get(
  "/displayStudentAssitantByEmail",
  authenticate('admin'),
  studentAssistantController.displayStudentAssistantByEmail
);

// Remove student assistant - Admin only (soft delete)
router.delete(
  "/removeStudentAssitantByEmail",
  authenticate('admin'),
  studentAssistantController.removeStudentAssistantByEmail
);

// Hard delete student assistant - Admin only (complete removal)
router.delete(
  "/hardDeleteStudentAssistant",
  authenticate('admin'),
  studentAssistantController.hardDeleteStudentAssistantByEmail
);

module.exports = router;