import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const base_url = "https://api.paystack.co";
const headers = {
  Authorization: `Bearer ${PAYSTACK_SECRET}`,
  "Content-Type": "application/json",
};

async function initiatePayment({ email, amount, name }) {
  try {
    const converted_amount = amount * 100;
    const response = await axios.post(
      `${base_url}/transaction/initialize`,
      {
        email: email,
        amount: converted_amount,
        metadata: {
          name: name,
        },
      },
      {
        headers,
      }
    );

    const { authorization_url, reference } = response.data.data;
    return { authorization_url, reference };
  } catch (error) {
    const msg =
      error.response?.data?.message || "Paystack initialization failed";
    throw new Error(msg);
  }
}

async function verifyPaymentStatus(trimmedreference) {
  try {
    const response = await axios.get(
      `${base_url}/transaction/verify/${trimmedreference}`,
      {
        headers,
      }
    );
    console.log(response.data);
    const data = response.data?.data;

    return {
      status: data.status,
      reference: data.reference,
      amount: data.amount,
      currency: data.currency,
      gateway_response: data.gateway_response,
      customer: {
        email: data.customer?.email,
        name: data.metadata.name,
      },
      transaction_date: data.transaction_date,

      message: "Payment verification successful",
    };
  } catch (error) {
    const message =
      error.response?.data?.message || "Payment verification failed";
    throw new Error(message);
  }
}

export { initiatePayment, verifyPaymentStatus };
