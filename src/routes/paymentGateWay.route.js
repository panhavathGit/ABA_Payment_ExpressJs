import express from "express";
import { checkTransaction } from "../controllers/checkTransaction.controller.js";
import { generateQR } from "../controllers/generateQR.controller.js";

const router = express.Router();

// Generate qr code
router.post("/qr", generateQR);

// Check payment status
router.post("/check", checkTransaction);

export default router;
