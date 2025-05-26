import * as paymentService from "../services/payment.service.js";

async function createPaymentRequest(req, res) {
  try {
    const { name, email, amount } = req.body;
    const { authorization_url, reference } =
      await paymentService.initiatePayment({
        name,
        email,
        amount,
      });

    return res.status(201).json({
      message: "Payment initialized successfully",
      data: {
        authorization_url,
        reference,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Something went wrong",
    });
  }
}

async function verifyPaymentStatus(req, res) {
  const reference = req.params.reference?.trim();

  if (!reference) {
    return res.status(400).json({
      success: false,
      message: "Missing payment reference in URL",
    });
  }
  try {
    const result = await paymentService.verifyPaymentStatus(trimmedReference);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}

export { createPaymentRequest, verifyPaymentStatus };
