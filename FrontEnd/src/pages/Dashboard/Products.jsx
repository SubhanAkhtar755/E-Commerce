// 📂 pages/Admin/Products.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Edit, Trash2, Search, Plus } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDarkMode } from "../../context/DarkModeContext.jsx";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();

  const theme = darkMode
    ? {
        bg: "bg-[#111827]",
        card: "bg-[#1F2937] border border-gray-700",
        text: "text-[#F9FAFB]",
        secondary: "text-[#9CA3AF]",
        border: "border-gray-700",
        input: "bg-[#1F2937] border border-gray-600 text-white",
      }
    : {
        bg: "bg-[#F9FAFB]",
        card: "bg-white border border-gray-200",
        text: "text-[#111827]",
        secondary: "text-[#4B5563]",
        border: "border-gray-300",
        input: "bg-white border border-gray-300 text-black",
      };

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/products");
      const data = res.data.products || res.data;
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching products");
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this product?")) return;
    try {
      await axios.delete(`/api/products/${id}`, {
        withCredentials: true,
      });
      toast.success("Product deleted");
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("Error deleting product");
    }
  };

  // Edit product
  const handleEdit = (id) => {
    navigate(`/Dashboard/products/edit/${id}`);
  };

  // Go to details
  const handleDetails = (id) => {
    navigate(`/ProductsDetails/${id}`);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔎 Search filter
  const filteredProducts = products.filter((p) => {
    const searchText = search.toLowerCase().trim();
    const productName = (p.name || "").toLowerCase();
    const productBrand = (p.brand || "").toLowerCase();

    return (
      productName.includes(searchText) || productBrand.includes(searchText)
    );
  });

  return (
    <div className={`pt-5 space-y-3 min-h-screen ${theme.bg} ${theme.text}`}>
      {/* 🔹 Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-xl font-bold">Products</h2>
        <button
          onClick={() => navigate("/dashboard/add")}
          className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition text-sm"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* 🔎 Searchbar */}
      <div className="relative max-w-md mx-auto p-2">
        <input
          type="text"
          placeholder="Search products by name or brand..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full pl-10 pr-3 py-2 rounded-md ${theme.input} focus:ring focus:ring-blue-400`}
        />
        <Search
          size={18}
          className="absolute left-3 top-5 text-gray-400 pointer-events-none"
        />
      </div>

      {/* Products List */}
      {filteredProducts.length === 0 ? (
        <p className={`text-center ${theme.secondary}`}>No products found</p>
      ) : (
        filteredProducts.map((product) => (
          <div
            key={product._id}
            onClick={() => handleDetails(product._id)}
            className={`relative flex gap-3 w-full shadow-sm rounded p-2 hover:shadow-md transition cursor-pointer  items-center ${theme.card}`}
          >
            {/* SALE Badge */}
            {product.sale && (
              <span className="absolute -top-1 -left-0 bg-red-500 text-white text-xs px-2 py-0.5 rounded">
                SALE
              </span>
            )}

            {/* Image */}
            <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded">
              <img
                src={
                  product.images?.[0]?.url ||
                  "https://via.placeholder.com/100?text=No+Image"
                }
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="flex-1 flex flex-col justify-between">
              <h3 className="text-sm font-semibold line-clamp-2">
                {product.name}
              </h3>
              <p className={`text-xs ${theme.secondary}`}>
                {product.brand || "No Brand"}
              </p>

              {/* Price & Stock */}
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-2">
                  <p className="text-[#F59E0B] font-semibold text-sm">
                    $
                    {product.discountprice > 0
                      ? product.discountprice
                      : product.price}
                  </p>
                  {product.discountprice > 0 && (
                    <p className="line-through text-gray-400 text-xs">
                      ${product.price}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Actions + Stock */}
            <div className="flex flex-col justify-between items-end gap-1">
              <div className="flex flex-col gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(product._id);
                  }}
                  className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white text-xs rounded"
                >
                  <Edit size={14} /> Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(product._id);
                  }}
                  className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white text-xs rounded"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
              {/* Stock at bottom right */}
              <p className={`text-xs ${theme.secondary} mt-1`}>
                Stock: <span className="font-medium">{product.stock || 0}</span>
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Products;
