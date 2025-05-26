import express from "express";
import morgan from "morgan";
import paymentRoute from "./routes/payment.route.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use("/api/v1/payment", paymentRoute);

export default app;
