const express = require("express");
const {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllCourses,
  deleteCourse,
  getAllOrders,
  getDashboardStats,
} = require("../../controllers/admin-controller/index");
const authenticate = require("../../middleware/auth-middleware");
const requireAdmin = require("../../middleware/admin-middleware");

const router = express.Router();

router.use(authenticate, requireAdmin);

router.get("/stats", getDashboardStats);

router.get("/users", getAllUsers);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

router.get("/courses", getAllCourses);
router.delete("/courses/:id", deleteCourse);

router.get("/orders", getAllOrders);

module.exports = router;
