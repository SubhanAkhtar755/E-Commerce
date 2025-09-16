import React from "react";
import { useDarkMode } from "../../../context/DarkModeContext"; // 👈 सही hook import

const PrivacyPolicy = () => {
  const { darkMode } = useDarkMode(); // ✅ Navbar जैसा use

  const theme = darkMode
    ? {
        bg: "bg-[#111827]",
        text: "text-[#F9FAFB]",
        accent: "text-[#F59E0B]",
        accentHover: "hover:text-[#F59E0B]",
        card: "bg-[#1F2937] border-gray-700",
        inputBg:
          "bg-[#1F2937] text-[#F9FAFB] placeholder-[#9CA3AF] border-gray-600 focus:ring-[#F59E0B]",
      }
    : {
        bg: "bg-[#F9FAFB]",
        text: "text-[#111827]",
        accent: "text-[#F59E0B]",
        accentHover: "hover:text-[#F59E0B]",
        card: "bg-white border-gray-200",
        inputBg:
          "bg-white text-[#111827] placeholder-[#4B5563] border-gray-300 focus:ring-[#3B82F6]",
      };

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} px-6 md:px-20 py-12`}>
      {/* Heading */}
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#3B82F6]">
          Privacy <span className={theme.accent}>Policy</span>
        </h1>
        
      </header>

      {/* Main Content */}
      <main className="space-y-12">
        {/* Section 1 */}
        <section
          className={`relative border-l-4 pl-6 ${
            darkMode ? "border-[#F59E0B]" : "border-[#3B82F6]"
          }`}
        >
          <h2 className="text-2xl font-bold">1. Information We Collect</h2>
          <p className="mt-3 leading-relaxed opacity-90">
            We collect personal details such as your name, email, and usage
            patterns to improve our services. This information helps us enhance
            user experience and provide personalized support.
          </p>
        </section>

        {/* Section 2 */}
        <section
          className={`relative border-l-4 pl-6 ${
            darkMode ? "border-[#F59E0B]" : "border-[#3B82F6]"
          }`}
        >
          <h2 className="text-2xl font-bold">2. How We Use Your Data</h2>
          <p className="mt-3 leading-relaxed opacity-90">
            The information you provide is used solely to operate, maintain, and
            improve our services. We never sell or misuse your data.
          </p>
        </section>

        {/* Section 3 */}
        <section
          className={`relative border-l-4 pl-6 ${
            darkMode ? "border-[#F59E0B]" : "border-[#3B82F6]"
          }`}
        >
          <h2 className="text-2xl font-bold">3. Data Protection</h2>
          <p className="mt-3 leading-relaxed opacity-90">
            We implement strict security measures to ensure your personal
            information is safe. However, no online method is 100% secure.
          </p>
        </section>

        {/* Section 4 */}
        <section
          className={`relative border-l-4 pl-6 ${
            darkMode ? "border-[#F59E0B]" : "border-[#3B82F6]"
          }`}
        >
          <h2 className="text-2xl font-bold">4. Your Rights</h2>
          <p className="mt-3 leading-relaxed opacity-90">
            You have the right to access, update, or delete your personal data.
            Please contact us if you wish to exercise any of these rights.
          </p>
        </section>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
