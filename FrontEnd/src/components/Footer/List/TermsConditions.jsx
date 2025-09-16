import React from "react";
import { useDarkMode } from "../../../context/DarkModeContext"; // 👈 apne context ka path check karo

const TermsConditions = () => {
  const { darkMode } = useDarkMode(); // ✅ yaha parenthesis zaroori hai

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
          Terms & <span className={theme.accent}>Conditions</span>
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
          <h2 className="text-2xl font-bold">1. Acceptance of Terms</h2>
          <p className="mt-3 leading-relaxed opacity-90">
            By accessing and using our services, you agree to comply with these
            terms and conditions. If you do not agree, please discontinue use.
          </p>
        </section>

        {/* Section 2 */}
        <section
          className={`relative border-l-4 pl-6 ${
            darkMode ? "border-[#F59E0B]" : "border-[#3B82F6]"
          }`}
        >
          <h2 className="text-2xl font-bold">2. Use of Service</h2>
          <p className="mt-3 leading-relaxed opacity-90">
            Our platform is intended for lawful purposes only. Any misuse,
            including fraudulent or harmful activity, is strictly prohibited.
          </p>
        </section>

        {/* Section 3 */}
        <section
          className={`relative border-l-4 pl-6 ${
            darkMode ? "border-[#F59E0B]" : "border-[#3B82F6]"
          }`}
        >
          <h2 className="text-2xl font-bold">3. Limitation of Liability</h2>
          <p className="mt-3 leading-relaxed opacity-90">
            We are not liable for indirect damages, losses, or interruptions in
            service that may occur while using our platform.
          </p>
        </section>

        {/* Section 4 */}
        <section
          className={`relative border-l-4 pl-6 ${
            darkMode ? "border-[#F59E0B]" : "border-[#3B82F6]"
          }`}
        >
          <h2 className="text-2xl font-bold">4. Changes to Terms</h2>
          <p className="mt-3 leading-relaxed opacity-90">
            We reserve the right to update these terms at any time. Continued
            use of the service after changes means you accept the revised terms.
          </p>
        </section>
      </main>
    </div>
  );
};

export default TermsConditions;
