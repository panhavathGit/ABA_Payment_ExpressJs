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

### 4. Start the server

```bash
nodemon app.js
```

---

## API Endpoints (Testing in Postman solution with header and request body provided)

All routes are prefixed with whatever path you mount the router on in your main `app.js` (e.g. `/api/payment`).

### Generate QR Code

```
POST /qr
```

Generates a KHQR code for the customer to scan and pay.

**Header**
| Key          | Value              | 
|--------------|--------------------|
| Accept       | application/json   | 

**Request body:**

| Field        | Type     | Required | Description                          |
|--------------|----------|----------|--------------------------------------|
| `tran_id`    | string   | Yes      | Unique transaction ID                |
| `amount`     | number   | Yes      | Payment amount in USD                |
| `first_name` | string   | No       | Customer first name                  |
| `last_name`  | string   | No       | Customer last name                   |
| `email`      | string   | No       | Customer email                       |
               

**Example request:**
```json
{
  "tran_id": "tran3f9a1c2",
  "amount": 12.50,
  "first_name": "Panha",
  "last_name": "Vath",
  "email": "test@example.com",
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

## Resources

- [ABA PayWay Developer Docs](https://developer.payway.com.kh)
- [ABA PayWay Sandbox Registration](https://sandbox.payway.com.kh/register-sandbox/)