import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },

    products: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product" },
        name: String,
        brand: String,
        price: Number,
        discountprice: Number,
        quantity: { type: Number, default: 1 },
        image: String,
      },
    ],

shippingAddress: {
  type: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true },
  },
  required: true,
},

    // 💳 Payment Info
    paymentMethod: {
      type: String,
      enum: ["COD", "JazzCash", "Card"],
      default: "COD",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    transactionId: String,

    // 🚚 Order Status
    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Returned", "Cancelled"],
      default: "Pending",
    },

    // 🕒 Track delivery time (for return window)
    deliveredAt: Date,

    // 📦 Return Handling
    returnRequest: {
      requested: { type: Boolean, default: false },
      requestedAt: Date,
      returnCode: String, // ✅ unique code user/admin ke liye
      reason: { type: String }, // ✅ user ke taraf se reason
      issue: { type: String }, // 🆕 extra field for issue details
      images: [
        {
          url: String,
          public_id: String,
        },
      ], // ✅ user proof images (cloudinary links)
      status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected", "Completed"],
        default: "Pending",
      },
    },

    // ✅ Extra fields for quick frontend access
    isDelivered: { type: Boolean, default: false },
    isReturned: { type: Boolean, default: false },

    totalAmount: { type: Number },
  },
  { timestamps: true }
);

// 🚀 Middleware: update delivery/return flags
orderSchema.pre("save", function (next) {
  if (this.orderStatus === "Delivered") {
    this.isDelivered = true;
    this.isReturned = false;

    // ⏰ Save delivery time once
    if (!this.deliveredAt) {
      this.deliveredAt = new Date();
    }
  } else if (this.orderStatus === "Returned") {
    this.isReturned = true;
    this.isDelivered = true; // pehle deliver hota hai, phir return hota hai
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
