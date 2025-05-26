import http from "http";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();
const PORT = process.env.PORT;

const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`server running on PORT ${PORT}`);
});
