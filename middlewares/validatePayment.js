import { body, validationResult } from "express-validator";

/**
 * Payment Request Input Validator
 * Ensures clean, accurate, and safe input for payment processing
 */
const validatePaymentRequest = [
  // Name: required, string, only letters & spaces, 2–50 chars
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .bail()
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters.")
    .bail()
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Name must contain only letters and spaces."),

  // Email: required, valid email
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .bail()
    .isEmail()
    .withMessage("Email must be a valid email address.")
    .bail()
    .normalizeEmail(),

  // Amount: required, must be a real number (not string), > 0
  body("amount")
    .notEmpty()
    .withMessage("Amount is required.")
    .bail()
    .custom((value) => {
      if (typeof value !== "number") {
        throw new Error("Amount must be a number, not a string.");
      }
      return true;
    })
    .bail()
    .isFloat({ gt: 0 })
    .withMessage("Amount must be a number greater than 0."),
];

export default validatePaymentRequest;
