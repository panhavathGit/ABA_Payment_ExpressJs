import dotenv from "dotenv";
dotenv.config();

const BASE_URL = process.env.ABA_BASE_URL;

/**
 * ABA PayWay external API endpoints.
 *
 * Usage in controllers:
 *   import { AbaEndpoints } from '../config/abaEndpoints.js';
 *   const response = await axios.post(AbaEndpoints.generateQR, payload, ...);
 */
export const AbaEndpoints = {
  generateQR:       `${BASE_URL}/api/payment-gateway/v1/payments/generate-qr`,
  checkTransaction: `${BASE_URL}/api/payment-gateway/v1/payments/check-transaction-2`,
  
};