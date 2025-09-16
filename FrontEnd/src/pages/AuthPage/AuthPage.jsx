import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaGoogle } from "react-icons/fa";
import { useDarkMode } from "../../context/DarkModeContext";
import { useUser } from "../../context/UserContext"; // ✅ import
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // ✅ navigation hook
import { useCart } from "../../context/CartContext";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { darkMode } = useDarkMode();
  const { setUser } = useUser(); // ✅ user context
  const navigate = useNavigate(); // ✅ hook for redirect

  const { fetchCart } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // 🎨 Theme palettes
  const theme = darkMode
    ? {
        pageBg: "bg-[#111827]",
        cardBg: "bg-[#1F2937] border border-gray-700",
        text: "text-[#F9FAFB]",
        secondary: "text-[#9CA3AF]",
        input:
          "bg-[#1F2937] text-[#F9FAFB] placeholder-[#9CA3AF] border border-gray-600 focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]",
        btn: "bg-[#F59E0B] hover:bg-[#d97706] text-white",
        googleBtn:
          "border border-gray-600 text-[#F9FAFB] hover:bg-gray-700 transition",
      }
    : {
        pageBg: "bg-[#F9FAFB]",
        cardBg: "bg-white border border-gray-200",
        text: "text-[#111827]",
        secondary: "text-[#4B5563]",
        input:
          "bg-white text-[#111827] placeholder-[#4B5563] border border-gray-300 focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]",
        btn: "bg-[#F59E0B] hover:bg-[#d97706] text-white",
        googleBtn:
          "border border-gray-300 text-[#111827] hover:bg-[#f3f4f6] transition",
      };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const emailDomain = formData.email.split("@")[1]?.toLowerCase();
  if (!isLogin && emailDomain !== "gmail.com") {
    toast.error("❌ Only Gmail accounts are allowed to register.");
    return;
  }

  const toastId = toast.loading(isLogin ? "Logging in..." : "Registering...");

  try {
    const url = `https://e-commerce-1-f4a7.onrender.com/api/user/${
      isLogin ? "login" : "register"
    }`;

    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : { name: formData.name, email: formData.email, password: formData.password };

    const res = await axios.post(url, payload, { withCredentials: true });

    if (isLogin) {
      // ✅ Login case
      const profile = await axios.get(
        "https://e-commerce-1-f4a7.onrender.com/api/user/my-profile",
        { withCredentials: true }
      );
      setUser(profile.data.user);
      await fetchCart();

      toast.update(toastId, {
        render: res.data.message || "Login successful!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      setTimeout(() => navigate("/"), 500);
    } else {
      // ✅ Register case
      toast.update(toastId, {
        render: res.data.message || "Registered successfully! Please login.",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      setTimeout(() => {
        setIsLogin(true); // switch to login form
        navigate("/AuthPage"); // ya jo bhi tumhari login page route hai
      }, 500);
    }

    setFormData({ name: "", email: "", password: "" });
  } catch (err) {
    toast.update(toastId, {
      render: err.response?.data?.message || "Something went wrong. Try again!",
      type: "error",
      isLoading: false,
      autoClose: 3000,
    });
  }
};

  return (
    <div
      className={`pt-10 flex items-center justify-center pb-10 px-4 ${theme.pageBg}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full max-w-md shadow-xl p-8 rounded-xl ${theme.cardBg}`}
      >
        {/* Title */}
        <h2 className={`text-2xl font-bold text-center mb-2 ${theme.text}`}>
          {isLogin ? "Welcome Back 👋" : "Create Account ✨"}
        </h2>
        <p className={`text-sm text-center mb-6 ${theme.secondary}`}>
          {isLogin
            ? "Login to your account to continue shopping"
            : "Register to start your premium shopping journey"}
        </p>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className={`w-full px-4 py-2 rounded outline-none transition ${theme.input}`}
            />
          )}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            required
            className={`w-full px-4 py-2 rounded outline-none transition ${theme.input}`}
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className={`w-full px-4 py-2 rounded outline-none transition ${theme.input}`}
          />

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full font-medium py-2 rounded transition ${theme.btn}`}
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        {/* Google Button */}
        <div className="mt-4">
          <button
            className={`w-full flex items-center justify-center gap-2 py-2 rounded ${theme.googleBtn}`}
          >
            <FaGoogle className="text-[#3B82F6]" />
            Continue with Google
          </button>
        </div>

        {/* Toggle Login/Register */}
        <p className={`text-center text-sm mt-6 ${theme.secondary}`}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#F59E0B] hover:underline font-medium"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
