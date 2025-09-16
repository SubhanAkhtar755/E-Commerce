import React, { useMemo, useState, useEffect } from "react";
import { useDarkMode } from "../../context/DarkModeContext";
import { useProducts } from "../../context/ProductContext";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { toast } from "react-toastify";
import SpinnerOverlay from "../../components/Important/SpinnerOverlay.jsx";
import "../index.scss"; // Custom styles for slick dots

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
  <div className="w-full h-[250px] md:h-[400px] rounded-xl animate-shimmer mb-6" />
);

// ===== Custom Slider Arrows =====
const PrevArrow = ({ onClick, currentSlide }) => (
  <button
    onClick={onClick}
    disabled={currentSlide === 0}
    className={`hidden md:flex absolute -left-8 top-1/3 z-10 
      text-[#F59E0B] hover:text-[#d97706] transition ${
        currentSlide === 0 ? "opacity-30 cursor-not-allowed" : ""
      }`}
  >
    <ChevronLeft size={28} />
  </button>
);

const NextArrow = ({ onClick, currentSlide, slideCount, slidesToShow }) => (
  <button
    onClick={onClick}
    disabled={currentSlide >= slideCount - slidesToShow}
    className={`hidden md:flex absolute -right-8 top-1/3 z-10 
      text-[#F59E0B] hover:text-[#d97706] transition ${
        currentSlide >= slideCount - slidesToShow
          ? "opacity-30 cursor-not-allowed"
          : ""
      }`}
  >
    <ChevronRight size={28} />
  </button>
);

// ===== Helper: shuffle array =====
const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);

const Home = () => {
  const { darkMode } = useDarkMode();
  const { products, loading, error } = useProducts();
  const [currentSlide, setCurrentSlide] = useState(0);

  const theme = darkMode
    ? {
        bg: "bg-[#111827]",
        text: "text-[#F9FAFB]",
        secondary: "text-[#9CA3AF]",
        card: "bg-[#1F2937] border-gray-700",
      }
    : {
        bg: "bg-[#F9FAFB]",
        text: "text-[#111827]",
        secondary: "text-[#4B5563]",
        card: "bg-white border-gray-200",
      };

  // Shuffle Flash Sale Products
  const saleProducts = useMemo(
    () => shuffleArray(products.filter((p) => p.sale === true)),
    [products]
  );

  // Shuffle Featured Products
  const featuredProducts = useMemo(() => shuffleArray(products), [products]);

  // ===== Toast Loading =====
  useEffect(() => {
    if (loading) toast.loading("Fetching products...", { toastId: "homeLoading" });
    else toast.dismiss("homeLoading");
  }, [loading]);

  // ===== Skeleton Loader =====
  if (loading) {
    return (
      <div className={`min-h-screen ${theme.bg} ${theme.text} relative`}>
        <SpinnerOverlay show={true} />

        {/* Skeleton Hero Banner */}
        <SkeletonBanner />

        {/* Skeleton Flash Sale */}
        <section className="px-2 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 w-40 bg-gray-400/30 rounded animate-shimmer"></div>
            <div className="h-4 w-24 bg-gray-400/30 rounded animate-shimmer"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, idx) => (
              <SkeletonCard key={idx} className="h-52" />
            ))}
          </div>
        </section>

        {/* Skeleton Featured Products */}
        <section className="px-2 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 w-48 bg-gray-400/30 rounded animate-shimmer"></div>
            <div className="h-4 w-24 bg-gray-400/30 rounded animate-shimmer"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {Array.from({ length: 5 }).map((_, idx) => (
              <SkeletonCard key={idx} className="h-52" />
            ))}
          </div>
        </section>
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

  // Hero Banner Slider Settings
  const bannerSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  // Flash Sale Slider Settings
  const flashSettings = {
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    swipeToSlide: true,
    draggable: true,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
    nextArrow: (
      <NextArrow
        currentSlide={currentSlide}
        slideCount={saleProducts.length}
        slidesToShow={4}
      />
    ),
    prevArrow: <PrevArrow currentSlide={currentSlide} />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 1, arrows: false } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1, arrows: false } },
      { breakpoint: 480, settings: { slidesToShow: 2, slidesToScroll: 1, arrows: false } },
    ],
  };

  return (
    <div className={`${theme.bg} ${theme.text} min-h-screen transition`}>
      <section className="px-0">
        <Slider {...bannerSettings}>
          <div>
            <img
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1600"
              alt="Banner1"
              className="w-full h-[250px] md:h-[400px] object-cover"
            />
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600"
              alt="Banner2"
              className="w-full h-[250px] md:h-[400px] object-cover"
            />
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200"
              alt="Banner3"
              className="w-full h-[250px] md:h-[400px] object-cover"
            />
          </div>
        </Slider>
      </section>

      {/* Small Promo Banners */}
      <section className="px-6 md:px-16 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <img
          src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800"
          alt="Promo1"
          className="rounded-lg shadow-md"
        />
        <img
          src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1200"
          alt="Promo2"
          className="rounded-lg shadow-md"
        />
        <img
          src="https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=1200"
          alt="Promo3"
          className="rounded-lg shadow-md"
        />
        <img
          src="https://images.unsplash.com/photo-1507680434567-5739c80be1ac?w=1200"
          alt="Promo4"
          className="rounded-lg shadow-md"
        />
      </section>

      {/* Flash Sale Section */}
      {saleProducts.length > 0 && (
        <section className="px-2 lg:px-8 py-10 relative">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#F59E0B]">⚡ Flash Sale</h2>
            <span className="text-xs text-gray-400 italic">drag → products</span>
          </div>
          <Slider {...flashSettings}>
            {saleProducts.map((product) => {
              const hasDiscount =
                product.discountprice && product.discountprice < product.price;
              const discountPercentage = hasDiscount
                ? Math.round(
                    ((product.price - product.discountprice) / product.price) * 100
                  )
                : 0;

              return (
                <div key={product._id} className="px-1">
                  <Link
                    to={`/ProductsDetails/${product._id}`}
                    className={`rounded-lg shadow-md hover:shadow-xl transition border overflow-hidden block ${theme.card}`}
                  >
                    <div className="h-40 w-full overflow-hidden">
                      <img
                        src={
                          product.images?.[0]?.url ||
                          "https://via.placeholder.com/300"
                        }
                        alt={product.name}
                        className="h-full w-full object-cover transform hover:scale-105 transition duration-300"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-semibold line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[#F59E0B] font-bold">
                          RS {hasDiscount ? product.discountprice : product.price}
                        </span>
                        {hasDiscount && (
                          <span className="text-gray-400 line-through text-sm">
                            RS {product.price}
                          </span>
                        )}
                      </div>
                      {hasDiscount && (
                        <p className="text-green-600 text-xs">
                          Save {discountPercentage}% today!
                        </p>
                      )}
                    </div>
                  </Link>
                </div>
              );
            })}
          </Slider>
        </section>
      )}

      {/* Featured Products */}
      <section className="px-2 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#F59E0B]">🛍 Featured Products</h2>
          <Link
            to="/shop"
            className="text-sm font-medium text-[#3B82F6] hover:underline"
          >
            See More →
          </Link>
        </div>
        {featuredProducts.length === 0 ? (
          <p className={theme.secondary}>No products available.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {featuredProducts.slice(0, 10).map((product) => {
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
                  className={`rounded-lg shadow-md hover:shadow-xl transition border overflow-hidden ${theme.card}`}
                >
                  <div className="h-40 w-full overflow-hidden">
                    <img
                      src={
                        product.images?.[0]?.url ||
                        "https://via.placeholder.com/300"
                      }
                      alt={product.name}
                      className="h-full w-full object-cover transform hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-semibold line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[#F59E0B] font-bold">
                        RS {hasDiscount ? product.discountprice : product.price}
                      </span>
                      {hasDiscount && (
                        <span className="text-gray-400 line-through text-sm">
                          RS {product.price}
                        </span>
                      )}
                    </div>
                    {hasDiscount && (
                      <p className="text-green-600 text-xs">
                        Save {discountPercentage}% today!
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
