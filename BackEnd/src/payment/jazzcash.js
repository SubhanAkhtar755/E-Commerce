import { Router } from "express";
import crypto from "crypto";

const router = Router();

const JAZZCASH_CONFIG = {
  merchantId: process.env.JAZZCASH_MERCHANT_ID || "MC57035",
  password: process.env.JAZZCASH_PASSWORD || "123456",
  integritySalt: process.env.JAZZCASH_INTEGRITY_SALT || "abc123xyz456",
  returnUrl: process.env.JAZZCASH_RETURN_URL || "http://localhost:5173/",
};

// ✅ JazzCash ke liye hash generator
function generateJazzCashHash(data) {
  const sorted = Object.keys(data)
    .sort()
    .map((key) => `${data[key]}`)
    .join("&");

  return crypto
    .createHmac("sha256", JAZZCASH_CONFIG.integritySalt)
    .update(sorted)
    .digest("hex");
}

// ✅ JazzCash payment endpoint
router.post("/pay", (req, res) => {
  const { amount } = req.body;

  const txnRef = Date.now();
  const data = {
    pp_Version: "1.1",
    pp_TxnType: "MWALLET",
    pp_MerchantID: JAZZCASH_CONFIG.merchantId,
    pp_Password: JAZZCASH_CONFIG.password,
    pp_TxnRefNo: txnRef,
    pp_Amount: amount * 100, // JazzCash amount in paisa
    pp_ReturnURL: JAZZCASH_CONFIG.returnUrl,
    pp_TxnCurrency: "PKR",
    pp_TxnDateTime: new Date()
      .toISOString()
      .replace(/[-:TZ.]/g, "")
      .slice(0, 14),
    pp_BillReference: "ref123",
    pp_Description: "Test Transaction",
  };

  const secureHash = generateJazzCashHash(data);
  data.pp_SecureHash = secureHash;

  // ✅ Response
  res.json({
    success: true,
    method: "JazzCash",
    transactionId: "JAZZ-" + txnRef,
    status: "Paid",
    testMode: true,
    data, // return data for frontend
  });
});

export default router;
