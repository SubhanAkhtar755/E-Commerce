import React, { useEffect, useState, useMemo } from "react";
import { useProducts } from "../../../context/ProductContext";
import { useDarkMode } from "../../../context/DarkModeContext.jsx";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import SpinnerOverlay from "../../../components/Important/SpinnerOverlay.jsx";
import BottomSpinner from "../../../components/Important/BottomSpinner.jsx";
import "../../../pages/index.scss"; // shimmer styles

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
  <div className="w-full h-64 sm:h-72 md:h-80 rounded-2xl animate-shimmer mb-10" />
);

const Shop = () => {
  const { products, loading, error } = useProducts();
  const { darkMode } = useDarkMode();

  const theme = darkMode
    ? {
        bg: "bg-[#111827]",
        text: "text-[#F9FAFB]",
        accent: "text-[#F59E0B]",
        accentHover: "hover:text-[#F59E0B]",
        card: "bg-[#1F2937] border-gray-700",
        secondary: "text-gray-400",
      }
    : {
        bg: "bg-[#F9FAFB]",
        text: "text-[#111827]",
        accent: "text-[#F59E0B]",
        accentHover: "hover:text-[#F59E0B]",
        card: "bg-white border-gray-200",
        secondary: "text-gray-600",
      };

  const [visibleProducts, setVisibleProducts] = useState(8);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // ✅ Shuffle products once per render
  const shuffledProducts = useMemo(() => {
    if (!products) return [];
    return [...products].sort(() => Math.random() - 0.5);
  }, [products]);

  const loadMore = () => {
    if (visibleProducts < shuffledProducts.length) {
      setIsFetchingMore(true);
      setTimeout(() => {
        setVisibleProducts((prev) => prev + 8);
        setIsFetchingMore(false);
      }, 500);
    }
  };

  // Toast notifications
  useEffect(() => {
    if (loading)
      toast.loading("Fetching products...", { toastId: "loadingProducts" });
    else toast.dismiss("loadingProducts");

    if (error) toast.error(error, { toastId: "errorProducts" });
  }, [loading, error]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >=
        document.documentElement.scrollHeight
      ) {
        loadMore();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visibleProducts, shuffledProducts.length]);

  // ===== Loading Skeleton + SpinnerOverlay =====
  if (loading) {
    return (
      <div className={`min-h-screen ${theme.bg} ${theme.text} relative`}>
        <SpinnerOverlay show={true} />

        {/* Skeleton Banner */}
        <SkeletonBanner />

        {/* Skeleton Products Grid */}
        <div className="grid gap-2 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-7xl mx-auto lg:px-2 px-2">
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

  return (
    <div className={`min-h-screen pb-10 ${theme.bg} ${theme.text}`}>
      {/* Banner Section */}
      <div className="px-2 sm:px-2 lg:px-2 pt-10">
        <div className="relative w-full h-64 sm:h-72 md:h-80 rounded-2xl overflow-hidden shadow-lg">
          <img
            src="https://images.pexels.com/photos/532558/pexels-photo-532558.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Shop Banner"
             loading="lazy"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent flex flex-col items-center justify-center text-center px-4">
            <h1
              className={`text-3xl sm:text-5xl font-extrabold drop-shadow-lg ${theme.accent}`}
            >
              Discover Your Next Style
            </h1>
            <p className="mt-3 text-lg sm:text-xl text-gray-200 max-w-2xl">
              Shop the latest trends with exclusive offers. Premium quality,
              affordable prices, delivered to your doorstep.
            </p>
          </div>
        </div>
      </div>

      {/* Heading */}
      <div className="text-center py-10 px-4">
        <h2 className="text-3xl font-bold mb-2">Our Products</h2>
        <p className="text-gray-500">
          Discover the latest deals & best sellers
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid  gap-2 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-7xl mx-auto lg:px-2 px-2">
        {shuffledProducts.slice(0, visibleProducts).map((product) => {
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
              className="block "
            >
              <div
                className={`${theme.card} h-70 rounded-xl shadow-md hover:shadow-xl transition border overflow-hidden`}
              >
                <div className="h-40 w-full overflow-hidden">
                  <img
                    src={
                      product.images?.[0]?.url ||
                      "https://via.placeholder.com/300"
                    }
                    alt={product.name}
                     loading="lazy"
                    className="h-full w-full object-cover transform hover:scale-105 transition duration-300"
                  />
                </div>

                <div className="!p-3">
                  <h3 className="text-base font-semibold line-clamp-1 sm:line-clamp-2">
                    {product.name}
                  </h3> 
                  <div className="">
                    <div className="flex items-center gap-2 mt-1">
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

      {/* Bottom Spinner for Infinite Scroll */}
      {isFetchingMore && (
        <div className="flex justify-center py-6">
          <BottomSpinner />
        </div>
      )}
    </div>
  );
};

export default Shop;
