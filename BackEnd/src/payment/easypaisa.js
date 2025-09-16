import { Router } from "express";

const router = Router();

router.post("/pay", (req, res) => {
  const { amount } = req.body;
  const txnRef = Date.now();

  res.json({
    success: true,
    transactionId: "EASY-" + txnRef,
    status: "Paid",
    testMode: true,
  });
});

export default router;
