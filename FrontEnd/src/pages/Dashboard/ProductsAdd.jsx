// 📂 pages/Admin/ProductsAdd.jsx
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import JoditEditor from "jodit-react";
import { useParams, useNavigate } from "react-router-dom";
import { useDarkMode } from "../../context/DarkModeContext.jsx";

const ProductsAdd = ({ editMode = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editor = useRef(null);
  const { darkMode } = useDarkMode();

  const [formData, setFormData] = useState({
    name: "",
    content: "",
    price: "",
    discountprice: "",
    stock: "",
    category: "",
    brand: "",
    sale: false,
  });

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  // 🎨 Theme setup
  const theme = darkMode
    ? {
        bg: "bg-[#111827]",
        card: "bg-[#1F2937] border border-gray-700",
        text: "text-white",
        label: "text-gray-300",
        input: "bg-[#1F2937] border-gray-600 text-[#F9FAFB]",
      }
    : {
        bg: "bg-[#F9FAFB]",
        card: "bg-white border border-gray-200",
        text: "text-[#111827]",
        label: "text-gray-700",
        input: "bg-white border-gray-300 text-[#111827]",
      };

  // ✅ If edit mode → fetch product details
  useEffect(() => {
    if (editMode && id) {
      const fetchProduct = async () => {
        try {
          const res = await axios.get(
            `https://e-commerce-h7o7.onrender.com/api/products/${id}`
          );
          const product = res.data;

          setFormData({
            name: product.name,
            content: product.content,
            price: product.price,
            discountprice: product.discountprice || "",
            stock: product.stock,
            category: product.category,
            brand: product.brand || "",
            sale: product.sale || false,
          });

          setPreviews(product.images?.map((img) => img.url) || []);
        } catch (err) {
          console.error(err);
          toast.error("❌ Failed to load product");
        }
      };
      fetchProduct();
    }
  }, [editMode, id]);

  // 🔹 Handle input fields
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 🔹 Handle multiple images
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviews(files.map((file) => URL.createObjectURL(file)));
  };

  // 🔹 Submit product
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      Object.keys(formData).forEach((key) => {
        form.append(key, formData[key]);
      });
      images.forEach((img) => {
        form.append("images", img);
      });

      if (editMode) {
        await axios.put(`https://e-commerce-h7o7.onrender.com/api/products/${id}`, form, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("✅ Product Updated Successfully!");
      } else {
        await axios.post("https://e-commerce-h7o7.onrender.com/api/products", form, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("✅ Product Added Successfully!");
      }

      navigate("/products");
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("❌ Failed to save product");
    }
  };

  // 🔹 Jodit Config
  const editorConfig = {
    readonly: false,
    height: 300,
    placeholder: "Write product description here...",
    toolbarAdaptive: false,
    uploader: { insertImageAsBase64URI: true },
  };

  return (
    <div
      className={`p-4 pt-5 max-w-4xl mx-auto rounded-lg ${theme.bg} ${theme.text}`}
    >
      <h2 className="text-2xl font-bold mb-6">
        {editMode ? "✏️ Edit Product" : "➕ Add New Product"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className={`space-y-6 ${theme.bg} rounded-lg`}
      >
        {/* Name */}
        <div>
          <label className={`block text-sm font-medium mb-1 ${theme.label}`}>
            Product Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            placeholder="Enter product name"
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded-md  ${theme.input}`}
            required
          />
        </div>

        {/* Content (Jodit Editor) */}
        <div className="pb-10 sm:pb-0">
          <label className={`block text-sm font-medium mb-1 ${theme.label}`}>
            Product Description
          </label>
          <JoditEditor
            ref={editor}
            value={formData.content}
            config={editorConfig}
            tabIndex={1}
            onBlur={(newContent) =>
              setFormData((prev) => ({ ...prev, content: newContent }))
            }
            onChange={() => {}}
          />
        </div>

        {/* Price + Discount */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${theme.label}`}>
              Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              placeholder="Enter price"
              onChange={handleChange}
              className={`w-full p-2 rounded  ${theme.input}`}
              required
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${theme.label}`}>
              Discount Price
            </label>
            <input
              type="number"
              name="discountprice"
              value={formData.discountprice}
              placeholder="Enter discount price"
              onChange={handleChange}
              className={`w-full p-2 rounded  ${theme.input}`}
            />
          </div>
        </div>

        {/* Stock + Category */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${theme.label}`}>
              Stock Quantity
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              placeholder="Enter stock"
              onChange={handleChange}
              className={`w-full p-2 rounded   ${theme.input}`}
              required
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${theme.label}`}>
              Category
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              placeholder="Enter category"
              onChange={handleChange}
              className={`w-full p-2 rounded  ${theme.input}`}
              required
            />
          </div>
        </div>

        {/* Brand */}
        <div>
          <label className={`block text-sm font-medium mb-1 ${theme.label}`}>
            Brand
          </label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            placeholder="Enter brand"
            onChange={handleChange}
            className={`w-full p-2 rounded  ${theme.input}`}
          />
        </div>

        {/* Sale */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="sale"
            checked={formData.sale}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600"
          />
          <label className={`text-sm ${theme.label}`}>On Sale</label>
        </div>

        {/* Images */}
        <div>
          <label className={`block text-sm font-medium mb-1 ${theme.label}`}>
            Upload Images
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
        </div>

        {/* Previews */}
        {previews.length > 0 && (
          <div>
            <p className={`text-sm mb-2 ${theme.label}`}>Image Previews:</p>
            <div className="grid grid-cols-3 gap-3">
              {previews.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="preview"
                  className="w-full h-32 object-cover rounded border"
                />
              ))}
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {editMode ? "Update Product" : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductsAdd;
