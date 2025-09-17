// 📂 pages/ProductsDetails/ProductsDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // ✅ navigate import
import { useProducts } from "../../context/ProductContext";
import { useDarkMode } from "../../context/DarkModeContext";
import { useCart } from "../../context/CartContext";
import Slider from "react-slick";
import axios from "axios";
import { toast } from "react-toastify";
import {
  ChevronLeft,
  ChevronRight,
  Share2,
  Minus,
  Plus,
  ShoppingCart,
  CreditCard,
} from "lucide-react";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../index.scss"; // shimmer & spin CSS
import SpinnerOverlay from "../../components/Important/SpinnerOverlay.jsx";

// ===== Skeleton Block =====
const SkeletonBlock = ({ className }) => (
  <div className={`rounded ${className} animate-shimmer`}></div>
);

// ===== Custom Slider Arrows =====
const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
  >
    <ChevronLeft size={22} />
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
  >
    <ChevronRight size={22} />
  </button>
);

const ProductsDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // ✅ hook
  const { products } = useProducts();
  const { darkMode } = useDarkMode();
  const { fetchCart } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const theme = darkMode
    ? {
        bg: "bg-[#111827]",
        text: "text-[#F9FAFB]",
        accent: "#F59E0B",
        accentBg: "bg-[#F59E0B]",
        accentHoverBg: "hover:bg-[#D97706]",
        accentBg1: "bg-[#3B82F6]",
        accentHoverBg1: "hover:bg-[#2563EB]",
        card: "bg-[#1F2937] border-gray-700",
      }
    : {
        bg: "bg-[#F9FAFB]",
        text: "text-[#111827]",
        accent: "#F59E0B",
        accentBg: "bg-[#F59E0B]",
        accentHoverBg: "hover:bg-[#D97706]",
        accentBg1: "bg-[#3B82F6]",
        accentHoverBg1: "hover:bg-[#2563EB]",
        card: "bg-white border-gray-200",
      };

  useEffect(() => {
    if (products.length > 0) {
      const found = products.find((p) => p._id === id);
      setProduct(found);
      setFetching(false);
    }
  }, [id, products]);

  // Skeleton Loader
  if (fetching || !product) {
    return (
      <div className={`mx-auto py-10 px-5 ${theme.bg} ${theme.text}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SkeletonBlock className="h-96 w-full" />
          <div className="flex flex-col gap-4">
            <SkeletonBlock className="h-8 w-3/4" />
            <SkeletonBlock className="h-6 w-1/2" />
            <SkeletonBlock className="h-10 w-1/4" />
            <div className="flex gap-3">
              <SkeletonBlock className="h-12 w-1/2" />
              <SkeletonBlock className="h-12 w-1/2" />
            </div>
            <div className="flex gap-4 mt-4">
              <SkeletonBlock className="h-12 w-1/2" />
              <SkeletonBlock className="h-12 w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const hasDiscount =
    product.discountprice && product.discountprice < product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.price - product.discountprice) / product.price) * 100)
    : 0;

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: product.name,
          text: "Check out this product!",
          url: window.location.href,
        })
        .catch((err) => console.log("Share failed:", err));
    } else {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
        "_blank"
      );
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    if (quantity < 1) {
      toast.warning("Quantity at least 1 honi chahiye");
      return;
    }
    if (quantity > product.stock) {
      toast.warning(`Stock me sirf ${product.stock} pieces hain`);
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        "http://localhost:4001/api/cart/add",
        {
          productId: product._id,
          name: product.name,
          brand: product.brand,
          price: product.price,
          discountprice: product.discountprice || 0,
          image: product.images?.[0]?.url || "",
          quantity,
        },
        { withCredentials: true }
      );
      toast.success("Added to cart 🛒");
      fetchCart();
    } catch (err) {
      toast.error("Cart me add nahi hua ❌");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Buy Now ka handler
  const handleBuyNow = () => {
    if (product.stock === 0) {
      toast.warning("Product out of stock ❌");
      return;
    }

    navigate("/checkout", {
      state: {
        productId: product._id,
        name: product.name,
        brand: product.brand,
        price: product.discountprice || product.price,
        image: product.images?.[0]?.url || "",
        quantity,
      },
    });
  };

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    appendDots: (dots) => (
      <div>
        <ul className="flex justify-center gap-2 mt-2">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-[9px] h-[9px] rounded-full bg-gray-400"></div>
    ),
  };

  return (
    <div
      className={`mx-auto py-10 px-5 ${theme.bg} ${theme.text} ${
        loading ? "pointer-events-none" : ""
      }`}
    >
      <SpinnerOverlay show={loading} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Slider */}
        <div className="relative">
          <Slider {...settings}>
            {product.images && product.images.length > 0 ? (
              product.images.map((img, i) => (
                <div key={i} className="h-96">
                  <img
                    src={img.url}
                    alt={product.name}
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
              ))
            ) : (
              <div className="h-96">
                <img
                  src="https://via.placeholder.com/500"
                  alt="placeholder"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            )}
          </Slider>
        </div>

        {/* Right: Details */}
        <div className="flex flex-col">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold leading-snug">
            {product.name}
          </h2>
          <div className="flex items-center justify-between mt-2">
            <p className="text-sm">
              Brand:{" "}
              <span className="text-[#136cff] font-medium">
                {product.brand || "No Brand"}
              </span>
            </p>
            <button
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-gray-200/30"
            >
              <Share2 size={20} />
            </button>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-bold" style={{ color: theme.accent }}>
              RS {hasDiscount ? product.discountprice : product.price}
            </span>
            {hasDiscount && (
              <>
                <span className="text-sm line-through opacity-60">
                  RS {product.price}
                </span>
                <span className="text-sm">Save {discountPercentage}%</span>
              </>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">Quantity:</span>
              <div className={`flex items-center border rounded-lg ${theme.card}`}>
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 hover:bg-gray-300/30"
                  disabled={product.stock === 0}
                >
                  <Minus size={18} />
                </button>
                <span className="px-4">{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity((q) =>
                      Math.min(q + 1, Math.min(product.stock, 10))
                    )
                  }
                  className="px-3 py-2 hover:bg-gray-300/30"
                  disabled={product.stock === 0}
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
            <div>
              {product.stock > 0 ? (
                <span className="text-[#136cff] font-medium text-sm">
                  {product.stock} in stock
                </span>
              ) : (
                <span className="text-red-500 text-sm">Out of stock</span>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleAddToCart}
              disabled={loading || product.stock === 0}
              className={`flex items-center justify-center gap-2 px-6 py-3 ${theme.accentBg} text-white rounded-lg ${theme.accentHoverBg}`}
            >
              <ShoppingCart size={18} />
              {loading
                ? "Adding..."
                : product.stock > 0
                ? "Add to Cart"
                : "Unavailable"}
            </button>
            <button
              onClick={handleBuyNow} // ✅ navigate to checkout
              className={`flex items-center justify-center gap-2 px-6 py-3 ${theme.accentBg1} text-white rounded-lg ${theme.accentHoverBg1}`}
              disabled={product.stock === 0}
            >
              <CreditCard size={18} /> Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsDetails;
