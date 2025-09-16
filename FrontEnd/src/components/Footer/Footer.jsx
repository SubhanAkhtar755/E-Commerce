import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useDarkMode } from "../../context/DarkModeContext.jsx";

const Footer = () => {
  const { darkMode } = useDarkMode();

  // 🎨 Theme palettes (same structure as Navbar)
  const theme = darkMode
    ? {
        bg: "bg-[#111827]",
        text: "text-[#F9FAFB]",
        secondary: "text-[#9CA3AF]",
        border: "border-gray-700",
        card: "bg-[#1F2937] border-gray-700",
        iconBg: "bg-[#1F2937] border border-gray-600 hover:bg-[#F59E0B] hover:text-white",
      }
    : {
        bg: "bg-[#F9FAFB]",
        text: "text-[#111827]",
        secondary: "text-[#4B5563]",
        border: "border-gray-300",
        card: "bg-white border-gray-200",
        iconBg: "bg-white border border-gray-300 hover:bg-[#F59E0B] hover:text-white",
      };

  return (
    <footer className={`${theme.bg} ${theme.text} border-t border-gray-200 pt-12 pb-6 px-6 md:px-16`}>
      {/* Top Footer */}
      <div className={`grid grid-cols-1 md:grid-cols-4 gap-10 border-b ${theme.border} pb-10`}>
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-[#F59E0B] mb-4">
            Shop<span className="text-[#3B82F6]">Vibe</span>
          </h2>
          <p className={`${theme.secondary} leading-relaxed`}>
            Your premium online shopping destination. Quality products with
            trusted service, always for you.
          </p>

          {/* Social Icons */}
          <div className="flex space-x-4 mt-4">
            <a href="#" className={`p-2 rounded-full transition ${theme.iconBg}`}>
              <FaFacebookF />
            </a>
            <a href="#" className={`p-2 rounded-full transition ${theme.iconBg}`}>
              <FaInstagram />
            </a>
            <a href="#" className={`p-2 rounded-full transition ${theme.iconBg}`}>
              <FaTwitter />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4 relative">
            Quick Links
            <span className="absolute left-0 -bottom-1 w-12 h-[2px] bg-[#F59E0B]"></span>
          </h3>
          <ul className={`space-y-2 ${theme.secondary}`}>
            {["Home", "Shop", "About Us"].map((item, i) => {
              const path = ["/", "/shop", "/about", "/contact"][i];
              return (
                <li key={item}>
                  <Link
                    to={path}
                    className="hover:text-[#F59E0B] transition relative after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-[#F59E0B] hover:after:w-full after:transition-all after:duration-300"
                  >
                    {item}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-lg font-semibold mb-4 relative">
            Customer Service
            <span className="absolute left-0 -bottom-1 w-12 h-[2px] bg-[#F59E0B]"></span>
          </h3>
          <ul className={`space-y-2 ${theme.secondary}`}>
            <li><Link to="/faqs" className="hover:text-[#F59E0B] transition relative after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-[#F59E0B] hover:after:w-full after:transition-all after:duration-300">FAQs</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-[#F59E0B] transition relative after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-[#F59E0B] hover:after:w-full after:transition-all after:duration-300">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-[#F59E0B] transition relative after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-[#F59E0B] hover:after:w-full after:transition-all after:duration-300">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4 relative">
            Contact Us
            <span className="absolute left-0 -bottom-1 w-12 h-[2px] bg-[#F59E0B]"></span>
          </h3>
          <p className={theme.secondary}>📍 Lahore, Pakistan</p>
          <p className={theme.secondary}>📞 +92 300 0886045</p>
          <p className={theme.secondary}>✉ support@shopvibe.com</p>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-6">
        <p className={`${theme.secondary} text-sm`}>
          © {new Date().getFullYear()} ShopVibe. All rights reserved.
        </p>
        <div className={`flex space-x-4 text-3xl mt-3 md:mt-0 ${theme.secondary}`}>
          <FaCcVisa className="hover:text-[#F59E0B] transition cursor-pointer" />
          <FaCcMastercard className="hover:text-[#F59E0B] transition cursor-pointer" />
          <FaCcPaypal className="hover:text-[#F59E0B] transition cursor-pointer" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
