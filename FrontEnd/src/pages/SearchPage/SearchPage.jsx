// SearchPage.jsx
import React, { useState, useEffect } from "react";
import { useProducts } from "../../context/ProductContext";
import { useDarkMode } from "../../context/DarkModeContext.jsx";
import { toast } from "react-toastify";
import { Link, useLocation } from "react-router-dom";
import SpinnerOverlay from "../../components/Important/SpinnerOverlay.jsx";
import BottomSpinner from "../../components/Important/BottomSpinner.jsx";
import "react-toastify/dist/ReactToastify.css";
import "../index.scss";

// ===== Skeleton Block =====
const SkeletonBlock = ({ className }) => (
  <div className={`rounded ${className} animate-shimmer`}></div>
);

const SearchPage = () => {
  const { products, loading, error } = useProducts();
  const { darkMode } = useDarkMode();
  const location = useLocation();

  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(8);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

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

  // Get query from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const q = searchParams.get("q") || "";
    setQuery(q);
  }, [location.search]);

  // Shuffle function
  const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

  // Filter products live based on query and shuffle
  useEffect(() => {
    const results = products.filter((p) => {
      const q = query.toLowerCase();
      const titleMatch = p.name?.toLowerCase().includes(q);
      const descMatch = p.category?.toLowerCase().includes(q);
      return titleMatch || descMatch;
    });

    setFiltered(shuffleArray(results));
  }, [products, query]);

  // Infinite scroll
  const loadMore = () => {
    if (visibleProducts < filtered.length) {
      setIsFetchingMore(true);
      setTimeout(() => {
        setVisibleProducts((prev) => prev + 8);
        setIsFetchingMore(false);
      }, 500);
    }
  };

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
  }, [visibleProducts, filtered.length]);

  // Toast notifications
  useEffect(() => {
    if (loading) toast.loading("Fetching products...", { toastId: "loadingProducts" });
    else toast.dismiss("loadingProducts");
    if (error) toast.error(error, { toastId: "errorProducts" });
  }, [loading, error]);

  // Skeleton while loading
  if (loading) {
    return (
      <div className={`min-h-screen ${theme.bg} ${theme.text} relative`}>
        <SpinnerOverlay show={true} />
        <div className="max-w-7xl mx-auto p-4 grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <SkeletonBlock key={i} className="h-60 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme.bg} ${theme.text}`}>
        <p className="text-xl">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-10 ${theme.bg} ${theme.text}`}>
      {/* Heading */}
      <div className="text-center py-10 px-4">
        <h2 className="text-3xl font-bold mb-2">Search Results for "{query}"</h2>
        <p className="text-gray-500">
          {filtered.length} product{filtered.length !== 1 && "s"} found
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid gap-2 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-7xl mx-auto lg:px-2 px-2">
        {filtered.slice(0, visibleProducts).map((product) => {
          const hasDiscount =
            product.discountprice && product.discountprice < product.price;
          const discountPercentage = hasDiscount
            ? Math.round(((product.price - product.discountprice) / product.price) * 100)
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

      {/* Infinite Scroll Bottom Spinner */}
      {isFetchingMore && (
        <div className="flex justify-center py-6">
          <BottomSpinner />
        </div>
      )}

    </div>
  );
};

export default SearchPage;
