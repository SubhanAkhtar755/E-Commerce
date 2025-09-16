// 📂 orders/services/paymentService.js
import { updateOrder } from "../db/index.js";

export const updatePaymentStatusService = async (id, paymentData) => {
  return await updateOrder(id, {
    paymentStatus: paymentData.status,
    transactionId: paymentData.transactionId,
  });
};
