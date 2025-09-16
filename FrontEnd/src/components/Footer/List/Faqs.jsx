import React, { useState } from "react";
import { useDarkMode } from "../../../context/DarkModeContext"; // ✅ apna context ka import

const Faqs = () => {
  const { darkMode } = useDarkMode(); // ✅ context se darkMode value
  const [openIndex, setOpenIndex] = useState(null);

  // ✅ theme object tumhara diya hua
  const theme = darkMode
    ? {
        bg: "bg-[#111827]",
        text: "text-[#F9FAFB]",
        accent: "text-[#F59E0B]",
        accentHover: "hover:text-[#F59E0B]",
        card: "bg-[#1F2937] border border-gray-700",
        inputBg:
          "bg-[#1F2937] text-[#F9FAFB] placeholder-[#9CA3AF] border-gray-600 focus:ring-[#F59E0B]",
      }
    : {
        bg: "bg-[#F9FAFB]",
        text: "text-[#111827]",
        accent: "text-[#F59E0B]",
        accentHover: "hover:text-[#F59E0B]",
        card: "bg-white border border-gray-200",
        inputBg:
          "bg-white text-[#111827] placeholder-[#4B5563] border-gray-300 focus:ring-[#3B82F6]",
      };

  const faqs = [
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept Credit/Debit Cards, PayPal, and Cash on Delivery for your convenience.",
    },
    {
      question: "How long does shipping take?",
      answer:
        "Orders are processed within 24 hours and typically delivered within 3–5 business days.",
    },
    {
      question: "Can I return a product?",
      answer:
        "Yes! You can return products within 7 days of delivery if they are unused and in original packaging.",
    },
    {
      question: "Do you offer international shipping?",
      answer:
        "Currently, we only deliver within the country, but international shipping will be available soon.",
    },
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={`py-12 px-6 sm:px-12 ${theme.bg}`}>
      <div className="max-w-4xl mx-auto">
        <h2
          className={`text-3xl sm:text-4xl font-extrabold text-center mb-8 text-[#3B82F6]`}
        >
          Frequently Asked <span className={theme.accent}>Questions</span>
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`rounded-lg shadow-md p-4 cursor-pointer transition ${theme.card}`}
              onClick={() => toggleFaq(index)}
            >
              <div className="flex justify-between items-center">
                <h3 className={`text-lg font-semibold ${theme.text}`}>
                  {faq.question}
                </h3>
                <span className={`text-xl font-bold ${theme.text}`}>
                  {openIndex === index ? "−" : "+"}
                </span>
              </div>

              {openIndex === index && (
                <p className={`mt-2 text-sm ${theme.text}`}>{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faqs;
