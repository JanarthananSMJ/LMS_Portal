const User = require("../../models/User");
const Course = require("../../models/Course");
const Order = require("../../models/Order");

const ALLOWED_ROLES = ["user", "instructor", "admin"];

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password").sort({ userName: 1 });

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred while fetching users",
    });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Role must be one of: ${ALLOWED_ROLES.join(", ")}`,
      });
    }

    if (id === req.user._id) {
      return res.status(400).json({
        success: false,
        message: "You cannot change your own role",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, fields: "-password" }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User role updated",
      data: updatedUser,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred while updating the user",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.user._id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred while deleting the user",
    });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({}).sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred while fetching courses",
    });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course deleted",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred while deleting the course",
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ orderDate: -1 });

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred while fetching orders",
    });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const [users, courses, orders] = await Promise.all([
      User.find({}, "role"),
      Course.find({}, "students pricing"),
      Order.find({}, "paymentStatus coursePricing"),
    ]);

    const totalStudents = users.filter(
      (u) => u.role !== "instructor" && u.role !== "admin"
    ).length;
    const totalInstructors = users.filter(
      (u) => u.role === "instructor"
    ).length;

    const totalEnrollments = courses.reduce(
      (sum, course) => sum + (course.students?.length || 0),
      0
    );

    const totalRevenue = orders
      .filter((order) => order.paymentStatus === "paid")
      .reduce((sum, order) => sum + (Number(order.coursePricing) || 0), 0);

    res.status(200).json({
      success: true,
      data: {
        totalUsers: users.length,
        totalStudents,
        totalInstructors,
        totalCourses: courses.length,
        totalOrders: orders.length,
        totalEnrollments,
        totalRevenue,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred while fetching dashboard stats",
    });
  }
};

module.exports = {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllCourses,
  deleteCourse,
  getAllOrders,
  getDashboardStats,
};
