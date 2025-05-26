// tests/controller/paymentController.test.js
import request from "supertest";
import { vi, describe, it, expect, beforeEach } from "vitest";
import app from "../../app.js";
import * as paymentService from "../../services/payment.service.js";

vi.mock("../../services/payment.service.js");

describe("Payment Controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/v1/payment", () => {
    it("should initialize a payment and return authorization_url and reference", async () => {
      paymentService.initiatePayment.mockResolvedValue({
        authorization_url: "https://paystack.com/checkout/12345",
        reference: "ref_12345",
      });

      const res = await request(app).post("/api/v1/payment").send({
        name: "John Doe",
        email: "john@example.com",
        amount: 1000,
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty(
        "message",
        "Payment initialized successfully"
      );
      expect(res.body.data).toMatchObject({
        authorization_url: expect.any(String),
        reference: expect.any(String),
      });
    });

    it("should handle errors from the service layer", async () => {
      paymentService.initiatePayment.mockRejectedValue(
        new Error("Paystack error")
      );

      const res = await request(app).post("/api/v1/payment").send({
        name: "John Doe",
        email: "john@example.com",
        amount: 1000,
      });

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty("message", "Paystack error");
    });
  });

  describe("GET /api/v1/payment/verify/:reference", () => {
    it("should return payment verification details", async () => {
      paymentService.verifyPaymentStatus.mockResolvedValue({
        status: "success",
        reference: "ref_123",
        amount: 100000,
        currency: "NGN",
        gateway_response: "Approved",
        customer: {
          email: "jane@example.com",
          name: "Jane Doe",
        },
        transaction_date: "2024-01-01",
        message: "Payment verification successful",
      });

      const res = await request(app).get("/api/v1/payment/verify/ref_123");

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("reference", "ref_123");
    });

    it("should return 400 if reference is missing", async () => {
      const res = await request(app).get("/api/v1/payment/verify/   ");

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty(
        "message",
        "Missing payment reference in URL"
      );
    });

    it("should handle service layer errors", async () => {
      paymentService.verifyPaymentStatus.mockRejectedValue(
        new Error("Invalid reference")
      );

      const res = await request(app).get("/api/v1/payment/verify/invalid_ref");

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "Invalid reference");
    });
  });
});
