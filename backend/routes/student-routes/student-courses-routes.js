const express = require("express");
const {
  getCoursesByStudentId,
} = require("../../controllers/student-controller/student-courses-controller");
const authenticate = require("../../middleware/auth-middleware");

const router = express.Router();

router.get("/get/:studentId", authenticate, getCoursesByStudentId);

module.exports = router;
