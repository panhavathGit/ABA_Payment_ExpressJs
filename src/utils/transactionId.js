import crypto from "crypto";

export function generateTransactionId(length = 9) {
  const bytes = crypto.randomBytes(Math.ceil(length / 2));
  const hex = bytes.toString("hex").slice(0, length);
  return `tran${hex}`;
}

export default generateTransactionId;