import express from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import paymentRoute from "./routes/payment.route.js";

const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again later.",
});

app.use(limiter);
app.use(morgan("dev"));
app.use(express.json());
app.use("/api/v1/payment", paymentRoute);

export default app;
