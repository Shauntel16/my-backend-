const express = require("express");
const router = express.Router();
const studentAssistantController = require("../controllers/studentAssistant.controller");

router.post(
  "/addStudentAssistant",
  studentAssistantController.addStudentAssistant
);

router.get(
  "/displayAllStudentAssistants",
  studentAssistantController.displayAllStudentAssistants
);

router.get(
  "/displayStudentAssitantByEmail",
  studentAssistantController.displayStudentAssistantByEmail
);
router.delete(
  "/removeStudentAssitantByEmail",
  studentAssistantController.removeStudentAssistantByEmail
);

module.exports = router;