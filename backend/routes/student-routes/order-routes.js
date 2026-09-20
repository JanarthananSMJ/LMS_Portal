const express = require("express");
const {
  createOrder,
  capturePaymentAndFinalizeOrder,
  createMockOrder,
} = require("../../controllers/student-controller/order-controller");
const authenticate = require("../../middleware/auth-middleware");

const router = express.Router();

router.post("/create", authenticate, createOrder);
router.post("/capture", authenticate, capturePaymentAndFinalizeOrder);
router.post("/mock-purchase", authenticate, createMockOrder);

module.exports = router;
