import express from "express";
import * as paymentController from "../controllers/payment.controller.js";
import validatePaymentRequest from "../middlewares/validatePayment.js";
import handleValidationErrors from "../middlewares/handleValidationErrors.js";
const router = express.Router();

router.post(
  "/",
  validatePaymentRequest,
  handleValidationErrors,
  paymentController.createPaymentRequest
);
router.get("/verify/:reference", paymentController.verifyPaymentStatus);

export default router;
