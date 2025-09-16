import React, { useMemo, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDarkMode } from "../../context/DarkModeContext";
import { useProducts } from "../../context/ProductContext";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import SpinnerOverlay from "../../components/Important/SpinnerOverlay.jsx";
import BottomSpinner from "../../components/Important/BottomSpinner.jsx";
import "../index.scss"; // for .animate-shimmer

// ===== Skeleton Card =====
const SkeletonCard = ({ className }) => (
  <div
    className={`rounded-lg shadow-md border overflow-hidden animate-shimmer ${className}`}
  >
    <div className="h-40 w-full bg-gray-400/20" />
    <div className="p-3 space-y-2">
      <div className="h-3 w-3/4 bg-gray-400/30 rounded"></div>
      <div className="h-3 w-1/2 bg-gray-400/30 rounded"></div>
      <div className="h-3 w-1/4 bg-gray-400/30 rounded"></div>
    </div>
  </div>
);

// ===== Skeleton Banner =====
const SkeletonBanner = () => (
  <div className="w-full h-[250px] md:h-[400px] rounded-xl animate-shimmer mb-10" />
);

const CategoryPage = () => {
  const { slug } = useParams();
  const { darkMode } = useDarkMode();
  const { products, loading, error } = useProducts();

  const theme = darkMode
    ? {
        bg: "bg-[#111827]",
        text: "text-[#F9FAFB]",
        card: "bg-[#1F2937] border-gray-700",
        border: "border-gray-700",
        secondary: "text-gray-400",
        accent: "text-[#F59E0B]",
        accentHover: "hover:text-[#F59E0B]",
      }
    : {
        bg: "bg-[#F9FAFB]",
        text: "text-[#111827]",
        card: "bg-white border-gray-200",
        border: "border-gray-300",
        secondary: "text-gray-600",
        accent: "text-[#F59E0B]",
        accentHover: "hover:text-[#F59E0B]",
      };

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => p.category?.toLowerCase() === slug.toLowerCase())
      .sort(() => Math.random() - 0.5);
  }, [products, slug]);

  const [visibleProducts, setVisibleProducts] = useState(8);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >=
        document.documentElement.scrollHeight
      ) {
        if (visibleProducts < filteredProducts.length) {
          setIsFetchingMore(true);
          setTimeout(() => {
            setVisibleProducts((prev) => prev + 8);
            setIsFetchingMore(false);
          }, 500);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visibleProducts, filteredProducts.length]);

  // Toast Loading
  useEffect(() => {
    if (loading) toast.loading("Fetching products...", { toastId: "categoryLoading" });
    else toast.dismiss("categoryLoading");

    if (error) toast.error(error, { toastId: "categoryError" });
  }, [loading, error]);

  // ===== Skeleton Loader (Home style) =====
  if (loading) {
    return (
      <div className={`min-h-screen ${theme.bg} ${theme.text} relative`}>
        <SpinnerOverlay show={true} />

        {/* Skeleton Banner */}
        <SkeletonBanner />

        {/* Skeleton Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
          {Array.from({ length: 8 }).map((_, idx) => (
            <SkeletonCard key={idx} className="h-52" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${theme.bg} ${theme.text}`}
      >
        <p>{error}</p>
      </div>
    );
  }

  // ===== Everything else exactly same as before =====
  return (
    <div
      className={`min-h-screen flex flex-col justify-between ${theme.bg} ${theme.text} py-10 px-4`}
    >
      <div>
        {/* Banner Section */}
        <div className="relative w-full h-64 sm:h-72 md:h-80 rounded-xl overflow-hidden mb-10 shadow-lg">
          <img
            src="https://images.pexels.com/photos/532558/pexels-photo-532558.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt={slug}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent flex flex-col items-center justify-center text-center px-4">
            <h1
              className={`text-4xl sm:text-5xl font-extrabold capitalize drop-shadow-lg ${theme.accent}`}
            >
              {slug}
            </h1>
            <p className="mt-3 text-lg sm:text-xl text-gray-200 max-w-2xl drop-shadow-md">
              Discover the best collection of {slug}. Handpicked just for you — style, quality & unbeatable prices.
            </p>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 relative">
            {filteredProducts.slice(0, visibleProducts).map((product) => {
              const hasDiscount =
                product.discountprice && product.discountprice < product.price;
              const discountPercentage = hasDiscount
                ? Math.round(
                    ((product.price - product.discountprice) / product.price) * 100
                  )
                : 0;

              return (
                <Link
                  to={`/ProductsDetails/${product._id}`}
                  key={product._id}
                  className="block"
                >
                  <div
                    className={`${theme.card} rounded-xl shadow-md hover:shadow-xl transition border overflow-hidden`}
                  >
                    <div className="h-52 w-full overflow-hidden">
                      <img
                        src={product.images?.[0]?.url || "https://via.placeholder.com/300"}
                        alt={product.name}
                        className="h-full w-full object-cover transform hover:scale-105 transition duration-300"
                      />
                    </div>

                    <div className="p-4">
                      <h3 className="text-base font-semibold line-clamp-1 sm:line-clamp-2">
                        {product.name}
                      </h3>

                      <div className="mt-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-[#F59E0B]">
                            RS {hasDiscount ? product.discountprice : product.price}
                          </span>
                          {hasDiscount && (
                            <span className="text-sm text-gray-500 line-through">
                              RS {product.price}
                            </span>
                          )}
                        </div>
                        {hasDiscount && (
                          <p className="text-xs text-green-600">
                            Save {discountPercentage}% today!
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Infinite Scroll Bottom Spinner */}
        {isFetchingMore && (
          <div className="w-full flex justify-center py-6">
            <BottomSpinner />
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
