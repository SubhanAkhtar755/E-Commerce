// 📂 orders/services/returnService.js
import { requestReturn, updateReturnStatus } from "../db/index.js";
import cloudinary from "../../../utils/cloudinary.js";
import Order from "../models/index.js"; 

export const requestReturnService = async (id, reason, issue, images) => {
  const order = await Order.findById(id);

  if (!order) {
    throw new Error("Order not found");
  }

  // ✅ Check: Already requested?
  if (order.returnRequest?.requested) {
    throw new Error("Return request already submitted for this order");
  }

  // ✅ Sirf delivered orders ke liye
  if (order.orderStatus !== "Delivered") {
    throw new Error("Return request only allowed for delivered orders");
  }

  // ✅ 5 din ka limit
  const deliveredAt = order.deliveredAt || order.updatedAt;
  const now = new Date();
  const diffInMs = now - deliveredAt;
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  if (diffInDays > 5) {
    throw new Error("Return request window (5 days) has expired");
  }

  // ✅ Max 6 images upload
  const uploadedImages = await Promise.all(
    images.slice(0, 6).map((img) =>
      cloudinary.uploader.upload(img, { folder: "returns" })
    )
  );

  return await requestReturn(id, {
    requested: true,  
    requestedAt: now,
    reason,
    issue,
    images: uploadedImages.map((f) => ({
      url: f.secure_url,
      public_id: f.public_id,
    })),
  });
};

// 🟢 Admin: Update Return Status
export const updateReturnStatusService = async (id, status) => {
  const order = await updateReturnStatus(id, status);

  // ❌ Agar reject/approve → images delete kar do
  if (["Rejected", "Approved"].includes(status)) {
    if (order.returnRequest?.images?.length) {
      await Promise.all(
        order.returnRequest.images.map((img) =>
          cloudinary.uploader.destroy(img.public_id)
        )
      );
    }
  }

  return order;
};
