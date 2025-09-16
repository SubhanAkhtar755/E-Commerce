// 📂 orders/controllers/calculateController.js
import { calculateDeliveredRevenueService } from "../services/calculateService.js"; // ✅ Make sure this import path is correct

export const getDeliveredRevenueController = async (req, res) => {
  try {
    const {
      deliveredOrdersCount,
      totalReturnedCount,
      returnedCompletedCount,
      returnedRejectedCount,
      netRevenue,
      totalCompletedOrders, // ye naya field add kiya hai
    } = await calculateDeliveredRevenueService(); // ✅ Make sure this is defined in the service file

    res.status(200).json({
      success: true,
      deliveredOrdersCount,
      totalReturnedCount,
      returnedCompletedCount,
      returnedRejectedCount,
      netRevenue,
      totalCompletedOrders, // ye naya field add kiya hai
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message, // This is where "calculateDeliveredRevenueService is not defined" came from
    });
  }
};
