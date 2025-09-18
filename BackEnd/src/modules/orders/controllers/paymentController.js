// 📂 orders/controllers/paymentController.js
import { updatePaymentStatusService } from "../services/paymentService.js";

export const updatePaymentController = async (req, res) => {
  try {
    const { status, transactionId } = req.body;
    const order = await updatePaymentStatusService(req.params.id, {
      status,
      transactionId,
    });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
