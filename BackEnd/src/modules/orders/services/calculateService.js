import Order from "../models/index.js";

export const calculateDeliveredRevenueService = async () => {
  // Delivered ya Returned orders fetch karo
  const relevantOrders = await Order.find({
    orderStatus: { $in: ["Delivered", "Returned"] },
  });

  let deliveredOrdersCount = 0;
  let totalReturnedCount = 0;
  let returnedCompletedCount = 0;
  let returnedRejectedCount = 0;
  let netRevenue = 0;

  for (const order of relevantOrders) {
    const isReturned = order.returnRequest?.requested;
    const returnStatus = order.returnRequest?.status;

    // Delivered orders count karo
    if (order.orderStatus === "Delivered") {
      deliveredOrdersCount++;
    }

    // Returns count karo
    if (isReturned) {
      totalReturnedCount++;
      if (returnStatus === "Completed") {
        returnedCompletedCount++;
      } else if (returnStatus === "Rejected") {
        returnedRejectedCount++;
      }
    }

    // Amount calculate karo: 
    // - Delivered aur Returned dono ka amount plus karo (COD orders)
    if (order.paymentMethod === "COD") {
      netRevenue += order.totalAmount || 0;
    }

    // Minus karo sirf return completed orders ka amount (COD orders)
    if (isReturned && returnStatus === "Completed" && order.paymentMethod === "COD") {
      netRevenue -= order.totalAmount || 0;
    }
  }

  // Delivered orders + total returned orders ko add karke naya count banao
  const totalCompletedOrders = deliveredOrdersCount + totalReturnedCount;

  return {
    deliveredOrdersCount,
    totalReturnedCount,
    returnedCompletedCount,
    returnedRejectedCount,
    netRevenue,
    totalCompletedOrders, // ye naya field add kiya hai
  };
};
