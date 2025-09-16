// Navbar.jsx
import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { ShoppingCart, User, Search, Sun, Moon } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDarkMode } from "../../context/DarkModeContext.jsx";
import { useUser } from "../../context/UserContext.jsx";
import { useProducts } from "../../context/ProductContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import axios from "axios";

const Navbar = React.memo(() => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false); // ✅ only active when focused

  const dropdownRef = useRef(null);

  const { darkMode, toggleDarkMode } = useDarkMode();
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { cart, fetchCart, resetCart } = useCart(); // ⬅️ fetchCart destructure
  const cartCount = cart.length;

  // Unique categories
  const categories = useMemo(() => {
    return products
      .map((p) => p.category)
      .filter((c, i, arr) => c && arr.indexOf(c) === i);
  }, [products]);

  const navLinks = useMemo(
    () => [
      { name: "Home", path: "/" },
      { name: "Shop", path: "/shop" },
      { name: "Categories" },
      { name: "About Us", path: "/about" },
    ],
    []
  );

  // Close dropdowns when click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserMenu(false);
        setCatOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLinkClick = useCallback(() => {
    setUserMenu(false);
    setSearchOpen(false);
    setCatOpen(false);
    setIsSearching(false); // ✅ search inactive jab link click
    setSearchQuery("");
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        "https://e-commerce-h7o7.onrender.com/api/user/logout",
        {},
        { withCredentials: true }
      );

      setUser(null);
      resetCart(); // 👈 logout ke saath hi local cart empty
      navigate("/");
      setUserMenu(false);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const theme = darkMode
    ? {
        bg: "bg-[#111827]",
        text: "text-[#F9FAFB]",
        accentHover: "hover:text-[#F59E0B]",
        card: "bg-[#1F2937] border-gray-700",
        inputBg:
          "bg-[#1F2937] text-[#F9FAFB] placeholder-[#9CA3AF] border-gray-600 focus:ring-[#F59E0B]",
      }
    : {
        bg: "bg-[#F9FAFB]",
        text: "text-[#111827]",
        accentHover: "hover:text-[#F59E0B]",
        card: "bg-white border-gray-200",
        inputBg:
          "bg-white text-[#111827] placeholder-[#4B5563] border-gray-300 focus:ring-[#3B82F6]",
      };

  const underlineClasses = `
    relative px-4 py-2 transition inline-flex items-center
    focus:outline-none focus:ring-0
    before:absolute before:-bottom-1 before:left-4 before:h-[2px] before:bg-current
    before:w-0 before:transition-all before:duration-300
    hover:before:w-[calc(100%-2rem)] hover:text-[#F59E0B]
  `;

  // ✅ Search navigate only when active
  useEffect(() => {
    if (isSearching && searchQuery.trim() !== "") {
      navigate(`/search?q=${searchQuery.trim()}`);
    }
  }, [searchQuery, isSearching, navigate]);

  return (
    <nav
      className={`${theme.bg} ${theme.text} sticky top-0 z-50 border-b ${
        darkMode ? "border-gray-700" : "border-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between relative">
        {/* Logo */}
        <NavLink
          to="/"
          className="text-xl sm:text-2xl font-bold tracking-wide"
          onClick={handleLinkClick}
        >
          <span className="text-[#F59E0B]">Shop</span>
          <span className="text-[#3B82F6]">Vibe</span>
        </NavLink>

        {/* Desktop Nav */}
        <ul className="hidden lg:flex space-x-6 xl:space-x-1 text-base xl:text-lg font-medium relative">
          {navLinks.map((link) => (
            <li
              key={link.name}
              className="relative group"
              onMouseEnter={() =>
                link.name === "Categories" && setCatOpen(true)
              }
              onMouseLeave={() =>
                link.name === "Categories" && setCatOpen(false)
              }
            >
              {link.name === "Categories" ? (
                <button
                  onClick={(e) => e.preventDefault()}
                  className={`${underlineClasses} ${
                    catOpen
                      ? "text-[#F59E0B] font-semibold before:w-[calc(100%-2rem)]"
                      : theme.text
                  }`}
                >
                  {link.name}
                </button>
              ) : (
                <NavLink
                  to={link.path}
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    `${underlineClasses} ${
                      isActive
                        ? "text-[#F59E0B] font-semibold before:w-[calc(100%-2rem)]"
                        : theme.text
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              )}

              {/* Categories Dropdown */}
              {link.name === "Categories" && categories.length > 0 && (
                <div
                  className={`absolute top-full left-0 mt-2 grid grid-cols-2 gap-3 p-4 min-w-[260px] ${
                    theme.card
                  } shadow-xl rounded-lg transition-all duration-200 ${
                    catOpen
                      ? "opacity-100 visible translate-y-0"
                      : "opacity-0 invisible -translate-y-2"
                  }`}
                >
                  {categories.map((cat) => (
                    <NavLink
                      key={cat}
                      to={`/categories/${cat.toLowerCase()}`}
                      onClick={handleLinkClick}
                      className="px-3 py-2 rounded-md hover:bg-yellow-500 hover:text-white text-base tracking-wide"
                    >
                      {cat}
                    </NavLink>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>

        {/* Right Side */}
        <div className="flex items-center space-x-3 sm:space-x-5 relative">
          {/* Desktop Search */}
          <div className="hidden lg:block w-52 xl:w-64">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onFocus={() => setIsSearching(true)} // ✅ activate on focus
              onBlur={() => setIsSearching(false)} // ✅ deactivate on blur
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full px-3 py-2 text-sm lg:text-base rounded-md ${theme.inputBg} focus:outline-none focus:ring-1`}
            />
          </div>

          {/* Mobile Search Toggle */}
          <button
            className={`lg:hidden p-2 transition ${theme.accentHover}`}
            onClick={() => setSearchOpen((prev) => !prev)}
          >
            <Search size={22} />
          </button>

          {/* Dark/Light Toggle */}
          <button
            className="p-2 transition hover:text-[#F59E0B]"
            onClick={toggleDarkMode}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* ✅ Cart with live count */}
          <NavLink
            to="/cart"
            onClick={handleLinkClick}
            className={`relative p-2 transition ${theme.accentHover}`}
          >
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#F59E0B] text-white text-[10px] font-bold rounded-full px-1">
                {cartCount}
              </span>
            )}
          </NavLink>

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              className={`p-2 transition ${
                userMenu ? "text-[#F59E0B]" : theme.accentHover
              }`}
              onClick={() => setUserMenu((prev) => !prev)}
            >
              <User size={22} />
            </button>
            <div
              className={`absolute right-0 mt-2 w-56 ${
                theme.card
              } shadow-lg py-3 text-sm transition-all duration-300 origin-top rounded-lg ${
                userMenu
                  ? "scale-100 opacity-100"
                  : "scale-95 opacity-0 pointer-events-none"
              }`}
            >
              {/* Mobile nav inside dropdown */}
              <div className="lg:hidden flex flex-col space-y-2 px-3 pb-3 ">
                {navLinks.map((link) => (
                  <div key={link.name} className="relative">
                    {link.name === "Categories" && categories.length > 0 ? (
                      <details className="group">
                        <summary className="cursor-pointer px-2 py-2 rounded-md hover:text-[#F59E0B]">
                          {link.name}
                        </summary>
                        <div className="grid grid-cols-2 gap-2 mt-2 px-2">
                          {categories.map((cat) => (
                            <NavLink
                              key={cat}
                              to={`/categories/${cat.toLowerCase()}`}
                              onClick={handleLinkClick}
                              className="px-3 py-2 rounded hover:bg-yellow-500 hover:text-white text-sm"
                            >
                              {cat}
                            </NavLink>
                          ))}
                        </div>
                      </details>
                    ) : (
                      <NavLink
                        to={link.path}
                        onClick={handleLinkClick}
                        className={({ isActive }) =>
                          `${underlineClasses} block ${
                            isActive
                              ? "text-[#F59E0B] font-semibold before:w-[calc(100%-2rem)]"
                              : ""
                          } hover:text-[#F59E0B]`
                        }
                      >
                        {link.name}
                      </NavLink>
                    )}
                  </div>
                ))}
              </div>

              {/* User options */}
              {user ? (
                <>
                  <NavLink
                    to="/profile/info"
                    onClick={handleLinkClick}
                    className="block border-t border-gray-300 lg:border-none px-4 py-2 hover:text-[#F59E0B]"
                  >
                    Profile
                  </NavLink>
                  {user.email === "muhammadsubhan192128@gmail.com" && (
                    <NavLink
                      to="/dashboard/orders/all"
                      onClick={handleLinkClick}
                      className="block px-4 py-2 hover:text-[#F59E0B]"
                    >
                      Dashboard
                    </NavLink>
                  )}
                  <div className="border-t my-2" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-red-500 hover:text-white rounded-md"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <div className="border-t my-2" />
                  <NavLink
                    to="/AuthPage"
                    onClick={handleLinkClick}
                    className="block px-4 py-2 hover:text-[#F59E0B]"
                  >
                    Login
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div
        className={`lg:hidden absolute top-full left-0 w-full ${
          theme.bg
        } px-4 sm:px-6 py-3 border-b ${
          darkMode ? "border-gray-700" : "border-gray-200"
        } transition-all duration-300 overflow-hidden ${
          searchOpen
            ? "max-h-20 opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-2"
        }`}
      >
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onFocus={() => setIsSearching(true)} // ✅ active on focus
          onBlur={() => setIsSearching(false)} // ✅ inactive on blur
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full px-3 py-2 text-sm rounded-md ${theme.inputBg} focus:outline-none focus:ring-1`}
        />
      </div>
    </nav>
  );
});

export default Navbar;
