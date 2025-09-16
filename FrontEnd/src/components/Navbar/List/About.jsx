import React from "react";
import { useDarkMode } from "../../../context/DarkModeContext.jsx";
import { Link } from "react-router-dom";

const About = () => {
  const { darkMode } = useDarkMode();

  const theme = darkMode
    ? {
        bg: "bg-[#111827]",
        text: "text-[#F9FAFB]",
        card: "bg-[#1F2937] border-gray-700",
        accent: "text-[#F59E0B]",
      }
    : {
        bg: "bg-[#F9FAFB]",
        text: "text-[#111827]",
        card: "bg-white border-gray-200",
        accent: "text-[#F59E0B]",
      };

  return (
    <div className={`${theme.bg} ${theme.text} min-h-screen`}>
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className={`text-5xl font-extrabold mb-4 ${theme.accent}`}>
          About <span className="text-blue-500">ShopVibe</span>
        </h1>
        <p className="text-lg sm:text-xl max-w-3xl mx-auto">
          ShopVibe is where quality meets convenience. Our mission is to provide the best products with the ultimate shopping experience.
        </p>
      </section>

      {/* Diagonal Section */}
      <section className={`relative py-16 px-4 sm:px-6 lg:px-8`}>
        <div className="absolute top-0 left-0 w-full h-32 bg-[#F59E0B] skew-y-[-6deg] transform origin-top"></div>
        <div className="relative max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission */}
          <div className={`${theme.card} rounded-2xl shadow-2xl p-8 hover:scale-105 transition transform`}>
            <h2 className="text-2xl font-bold mb-3">Our Mission</h2>
            <p>
              To create an online store that delivers quality, reliability, and happiness in every order. Every product is selected with care for our customers.
            </p>
          </div>

          {/* Vision */}
          <div className={`${theme.card} rounded-2xl shadow-2xl p-8 hover:scale-105 transition transform`}>
            <h2 className="text-2xl font-bold mb-3">Our Vision</h2>
            <p>
              To be the most trusted and loved online shop by consistently delivering excellence, transparency, and unbeatable deals.
            </p>
          </div>

          {/* Values */}
          <div className={`${theme.card} rounded-2xl shadow-2xl p-8 hover:scale-105 transition transform`}>
            <h2 className="text-2xl font-bold mb-3">Our Values</h2>
            <p>
              Quality, customer satisfaction, and integrity are the pillars of everything we do. Our decisions are guided by these values.
            </p>
          </div>

          {/* Team */}
          <div className={`${theme.card} rounded-2xl shadow-2xl p-8 hover:scale-105 transition transform`}>
            <h2 className="text-2xl font-bold mb-3">Our Team</h2>
            <p>
              A passionate team of tech enthusiasts, designers, and customer-focused professionals dedicated to improving your shopping experience.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Join Our Journey</h2>
        <p className="max-w-2xl mx-auto mb-8">
          We’re constantly evolving and innovating to bring you the best online shopping experience. Be part of our growing community today.
        </p>
        <Link to="/shop" className="px-6 py-3 bg-[#F59E0B] hover:bg-[#F59E0B]/95 text-white font-bold rounded-full transition">
          Shop Now
        </Link>
      </section>
    </div>
  );
};

export default About;
