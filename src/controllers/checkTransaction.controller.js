import axios from "axios";
import crypto from "crypto";
import dotenv from "dotenv";
import { AbaEndpoints } from "../config/abaEndpoints.js";

dotenv.config();

/**
 * Check the status of an ABA transaction.
 *
 * Flow:
 *   1. Validate tran_id from the request body
 *   2. Generate a timestamp and HMAC SHA512 hash (req_time + merchant_id + tran_id)
 *   3. POST to ABA and return the transaction status to the client
 *
 * Hash input order (per ABA docs): req_time + merchant_id + tran_id
 *
 * POST /check
 * Body: { tran_id }
 */

const API_KEY = process.env.ABA_PUBLIC_KEY;
const MERCHANT_ID = process.env.ABA_MERCHANT_ID;

export const checkTransaction = async (req, res) => {
  try {
    const { tran_id } = req.body;
    if (!tran_id) return res.status(400).json({ error: "tran_id is required" });

    // ABA expects current timestamp format: YYYYMMDDHHMMSS
    const req_time = new Date()
      .toISOString()
      .replace(/[-:TZ.]/g, "")
      .slice(0, 14);

    // Concatenate for hash (req_time + merchant_id + tran_id)
    const b4hash = req_time + MERCHANT_ID + tran_id;

    // Generate HMAC SHA512 hash and Base64 encode
    const hash = crypto.createHmac("sha512", API_KEY).update(b4hash).digest("base64");

    const payload = {
      req_time,
      merchant_id: MERCHANT_ID,
      tran_id,
      hash,
    };

    const response = await axios.post(AbaEndpoints.checkTransaction,payload,{ 
      headers: { "Content-Type": "application/json" } 
    });

    return res.json(
      response.data
    );

  } catch (err) {
    console.error("Error checking transaction:", err.message);
    return res.status(500).json({ error: err.message });
  }
};
