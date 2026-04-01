import dotenv from "dotenv";
import axios from "axios";
import { generateMerchantAuth } from "./src/utils/merchantAuth.js";
import { generateRefundHash } from "./src/utils/generateRefundHash.js";

dotenv.config();

(async () => {
  try {
    const tran_id = "tran020";
    const refund_amount = "10.00";
    const request_time = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);

    // Generate encrypted merchant_auth
    const merchant_auth = generateMerchantAuth(tran_id, refund_amount);
    console.log("merchant_auth:", merchant_auth);

    // Generate HMAC hash
    const hash = generateRefundHash({
      request_time,
      merchant_id: process.env.ABA_MERCHANT_ID,
      merchant_auth
    });
    console.log("hash:", hash);

    console.log("request time:", request_time);

    // Construct payload
    const payload = {
      request_time,
      merchant_id: process.env.ABA_MERCHANT_ID,
      merchant_auth,
      hash,
      refund_amount
    };

    // Send POST request to ABA
    const response = await axios.post(
      "https://checkout-sandbox.payway.com.kh/api/merchant-portal/merchant-access/online-transaction/refund",
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("ABA Response:", response.data);

    // console.log("request time:", request_time);

  } catch (err) {
    console.error("Error sending refund request:", err.response?.data || err.message);
  }
})();
