import React from "react";
import { FaCcVisa, FaCcMastercard, FaCcPaypal } from "react-icons/fa";
import { useDarkMode } from "../../context/DarkModeContext.jsx";

const Footer2 = () => {
  const { darkMode } = useDarkMode();

  const theme = darkMode
    ? {
        bg: "bg-[#111827]",
        text: "text-[#F9FAFB]",
        accent: "text-[#F59E0B]",
        accentHover: "hover:text-[#F59E0B]",
        card: "bg-[#1F2937] border-gray-700",
        secondary: "text-gray-400",
        border: "border-gray-700", // ✅ added border
      }
    : {
        bg: "bg-[#F9FAFB]",
        text: "text-[#111827]",
        accent: "text-[#F59E0B]",
        accentHover: "hover:text-[#F59E0B]",
        card: "bg-white border-gray-200",
        secondary: "text-gray-600",
        border: "border-gray-200", // ✅ added border
      };

  return (
    <footer className={`${theme.bg}`}>
      {/* Top Border */}
      <div className={`border-t ${theme.border}`}></div>

      {/* Footer Content */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-10 pb-10 mx-4">
        <p className={`${theme.secondary} text-sm`}>
          © {new Date().getFullYear()} ShopVibe. All rights reserved.
        </p>

        <div
          className={`flex space-x-4 text-3xl mt-3 md:mt-0 ${theme.secondary}`}
        >
          <FaCcVisa
            className={`${theme.accentHover} transition cursor-pointer`}
          />
          <FaCcMastercard
            className={`${theme.accentHover} transition cursor-pointer`}
          />
          <FaCcPaypal
            className={`${theme.accentHover} transition cursor-pointer`}
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer2;
