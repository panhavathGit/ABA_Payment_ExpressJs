import axios from "axios";
import { generateAbaHash } from "../utils/generateQRHash.js";
import dotenv from "dotenv";
import { AbaEndpoints } from "../config/abaEndpoints.js";

dotenv.config();

/**
 * Generate an ABA KHQR payment QR code.
 *
 * POST /api/payment/qr
 * Body: { tran_id, amount, first_name?, last_name?, email?, phone?, items? }
 */

const API_KEY = process.env.ABA_PUBLIC_KEY;
const MERCHANT_ID = process.env.ABA_MERCHANT_ID;
const BASE_URL = process.env.ABA_BASE_URL;

export const generateQR = async (req, res) => {
  try {
    const { tran_id, amount, first_name, last_name, email, phone, items } = req.body;

    // Validation
    if (!tran_id || !amount) {
      return res.status(400).json({ error: "tran_id and amount are required" });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ error: "amount must be a positive number" });
    }

    // Encode items 
    // ABA expects items as a Base64-encoded JSON array
    let encodedItems = "";
    if (items && Array.isArray(items)) {
      encodedItems = Buffer.from(JSON.stringify(items)).toString("base64");
    }

    // ABA timestamp format: YYYYMMDDHHMMSS (UTC)
    const req_time = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);

    const params = {
      req_time,
      merchant_id: MERCHANT_ID,
      tran_id,
      amount: parsedAmount.toFixed(2),
      items: encodedItems,
      first_name: first_name || "",
      last_name: last_name || "",
      email: email || "",
      phone: phone || "",
      purchase_type: "purchase",
      payment_option: "abapay_khqr",
      callback_url: "",
      return_deeplink: "",
      currency: "USD",
      custom_fields: "",
      return_params: "",
      payout: "",
      lifetime: "6",
      qr_image_template: "template1_color",
      api_key: API_KEY, // used for hashing only — stripped before sending
    };

    const hash = generateAbaHash(params);

    // Remove api_key before sending payload to ABA
    const { api_key, ...payload } = params;
    payload.hash = hash;

    const response = await axios.post(
      AbaEndpoints.generateQR,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return res.json({ status: "success", data: response.data });

  } catch (err) {
    console.error("Error generating QR:", err.response?.data || err.message);
    return res.status(500).json({ error: err.response?.data || err.message });
  }
};