import express from "express";
import dotenv from "dotenv";
import payway from "./src/routes/paymentGateWay.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.use("/api/payway/transaction", payway);

app.get("/", (req, res) => {
  res.send("Welcome to ABA Payment API, by panhavath");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
