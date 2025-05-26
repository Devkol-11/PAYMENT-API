// tests/service/paymentService.test.js
import { describe, it, expect, beforeEach } from "vitest";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { initiatePayment, verifyPaymentStatus } from "../../services/payment.service.js";

const mock = new MockAdapter(axios);
const PAYSTACK_BASE = "https://api.paystack.co";

describe("Payment Service", () => {
  beforeEach(() => {
    mock.reset();
  });

  describe("initiatePayment", () => {
    it("should return authorization_url and reference on success", async () => {
      const mockResponse = {
        data: {
          data: {
            authorization_url: "https://paystack.com/pay/abc123",
            reference: "ref_abc123",
          },
        },
      };

      mock.onPost(`${PAYSTACK_BASE}/transaction/initialize`).reply(200, mockResponse.data);

      const result = await initiatePayment({
        email: "user@example.com",
        name: "User Test",
        amount: 1000,
      });

      expect(result).toEqual({
        authorization_url: "https://paystack.com/pay/abc123",
        reference: "ref_abc123",
      });
    });

    it("should throw an error on failure", async () => {
      mock.onPost(`${PAYSTACK_BASE}/transaction/initialize`).reply(400, {
        message: "Invalid email",
      });

      await expect(
        initiatePayment({ email: "bad", name: "x", amount: 100 })
      ).rejects.toThrow("Invalid email");
    });
  });

  describe("verifyPaymentStatus", () => {
    it("should return payment details on success", async () => {
      mock.onGet(`${PAYSTACK_BASE}/transaction/verify/ref_123`).reply(200, {
        data: {
          status: "success",
          reference: "ref_123",
          amount: 100000,
          currency: "NGN",
          gateway_response: "Approved",
          transaction_date: "2024-01-01",
          customer: {
            email: "test@example.com",
          },
          metadata: {
            name: "Test User",
          },
        },
      });

      const result = await verifyPaymentStatus("ref_123");

      expect(result).toMatchObject({
        status: "success",
        reference: "ref_123",
        amount: 100000,
        currency: "NGN",
        customer: {
          email: "test@example.com",
          name: "Test User",
        },
      });
    });

    it("should throw an error on failure", async () => {
      mock.onGet(`${PAYSTACK_BASE}/transaction/verify/invalid`).reply(404, {
        message: "Transaction not found",
      });

      await expect(verifyPaymentStatus("invalid")).rejects.toThrow("Transaction not found");
    });
  });
});
