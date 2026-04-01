# ABA PayWay Payment Backend

A Node.js + Express backend that integrates with [ABA PayWay](https://developer.payway.com.kh) to handle KHQR payment generation, transaction status checking.

---

## Features

- Generate ABA KHQR payment QR codes
- Check transaction payment status

---

## Project Structure

```
├── config/
│   ├── abaEndpoints.js       # ABA's external server URLs 
│  
├── controllers/
│   ├── generateQR.controller.js
│   ├── checkTransaction.controller.js
│  
├── routes/
│   └── paymentGateWay.route.js
│
├── utils/
│   ├── generateQRHash.js     # HMAC SHA512 hash for generate-qr request
│   └── transactionId.js      # Unique transaction ID generator
│
├── .env.example
└── README.md
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/panhavathGit/ABA_Payment_ExpressJs.git
cd ABA_Payment_ExpressJs
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Then open `.env` and fill in your credentials:

```env
# HMAC signing key — from ABA merchant portal (used to sign all requests)
ABA_PUBLIC_KEY=your_hmac_api_key_here

# Your ABA merchant ID
ABA_MERCHANT_ID=your_merchant_id_here

# ABA PayWay base URL
# Sandbox:    https://checkout-sandbox.payway.com.kh
# Production: https://checkout.payway.com.kh
ABA_BASE_URL=https://checkout-sandbox.payway.com.kh

# RSA public key provided by ABA Bank — used only for refund merchant_auth encryption
# Paste the raw Base64 value without PEM headers
ABA_RSA_PUBLIC_KEY=your_rsa_public_key_base64_here
```

> **Note:** Your IP or domain must be whitelisted by ABA PayWay before any API calls will succeed. Contact ABA at [paywaysales@ababank.com](mailto:paywaysales@ababank.com) to get whitelisted.

### 4. Start the server

```bash
# Development
npm run dev

# Production
npm start
```

---

## API Endpoints

All routes are prefixed with whatever path you mount the router on in your main `app.js` (e.g. `/api/payment`).

### Generate QR Code

```
POST /qr
```

Generates a KHQR code for the customer to scan and pay.

**Request body:**

| Field        | Type     | Required | Description                          |
|--------------|----------|----------|--------------------------------------|
| `tran_id`    | string   | Yes      | Unique transaction ID                |
| `amount`     | number   | Yes      | Payment amount in USD                |
| `first_name` | string   | No       | Customer first name                  |
| `last_name`  | string   | No       | Customer last name                   |
| `email`      | string   | No       | Customer email                       |
| `phone`      | string   | No       | Customer phone number                |
| `items`      | array    | No       | Array of item objects                |

**Example request:**
```json
{
  "tran_id": "tran3f9a1c2",
  "amount": 12.50,
  "first_name": "Dara",
  "last_name": "Chan",
  "email": "dara@example.com",
  "phone": "0971234567",
  "items": [
    { "name": "Product A", "quantity": 1, "price": 12.50 }
  ]
}
```

---

### Check Transaction Status

```
POST /check
```

Check whether a transaction has been paid. Call this after the customer scans the QR code.

**Request body:**

| Field     | Type   | Required | Description           |
|-----------|--------|----------|-----------------------|
| `tran_id` | string | Yes      | Transaction ID to check |

**Example request:**
```json
{
  "tran_id": "tran3f9a1c2"
}
```

---

### Refund Transaction

```
POST /refund
```

Issue a full or partial refund for a completed transaction. Refunds must be requested within 30 days of the original payment.

**Request body:**

| Field           | Type   | Required | Description                        |
|-----------------|--------|----------|------------------------------------|
| `tran_id`       | string | Yes      | Original transaction ID to refund  |
| `refund_amount` | number | Yes      | Amount to refund (must be > 0)     |

**Example request:**
```json
{
  "tran_id": "tran3f9a1c2",
  "refund_amount": 5.00
}
```

---

## How Request Signing Works

Every request to ABA must include a `hash` field — an HMAC SHA512 signature that ABA uses to verify the request came from a legitimate merchant and was not tampered with.

**Generate QR hash input:**
```
req_time + merchant_id + tran_id + amount + items + first_name + last_name
+ email + phone + purchase_type + payment_option + callback_url
+ return_deeplink + currency + custom_fields + return_params
+ payout + lifetime + qr_image_template
```

**Check transaction hash input:**
```
req_time + merchant_id + tran_id
```

**Refund hash input:**
```
request_time + merchant_id + merchant_auth
```

All hashes are signed with `ABA_PUBLIC_KEY` using HMAC SHA512 and Base64-encoded.

---

## How Refund Encryption Works

The refund endpoint requires a `merchant_auth` field — an RSA-encrypted proof of merchant identity. It is built as follows:

1. Serialize `{ mc_id, tran_id, refund_amount }` to a JSON string
2. Encrypt the JSON string using ABA's RSA public key (`ABA_RSA_PUBLIC_KEY`), in chunks of 117 bytes — the maximum allowed by RSA-PKCS1 padding on a 1024-bit key
3. Concatenate all encrypted chunks into a single buffer
4. Base64-encode the buffer → this is `merchant_auth`

This is a requirement from ABA. See `utils/encryptRSA.js` for the implementation.

> **Note:** `ABA_RSA_PUBLIC_KEY` (used for RSA encryption) and `ABA_PUBLIC_KEY` (used for HMAC signing) are two different keys — both are provided by ABA Bank.

---

## Going Live

1. Replace `ABA_BASE_URL` in your `.env` with the production URL:
   ```
   ABA_BASE_URL=https://checkout.payway.com.kh
   ```
2. Replace sandbox API keys with your production keys
3. Ensure your production domain or IP is whitelisted by ABA

No code changes are required to switch environments.

---

## Resources

- [ABA PayWay Developer Docs](https://developer.payway.com.kh)
- [ABA PayWay Sandbox Registration](https://sandbox.payway.com.kh/register-sandbox/)
- ABA Integration support: [paywaysales@ababank.com](mailto:paywaysales@ababank.com)