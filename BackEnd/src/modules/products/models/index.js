import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true, // ✅ Rich text editor (detailed description/specifications)
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
     discountprice: {
      type: Number,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    category: {
      type: String,
      required: true,
    },
     sale: {
      type: Boolean,
      default: false,
    },
    brand: {
      type: String,
    },
    // 🖼️ Multiple Images
    images: [
      {
        url: { type: String },
        public_id: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
