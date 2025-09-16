// BottomSpinner.jsx
import React from "react";

const BottomSpinner = () => {
  return (
    <div className="flex justify-center py-6">
      <div className="relative w-12 h-12">
        {/* Outer circle (amber) */}
        <svg className="w-12 h-12 animate-spin" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="transparent"
            stroke="#F59E0B"
            strokeWidth="6"
            strokeDasharray="28 28"
            strokeLinecap="round"
          />
        </svg>

        {/* Inner opposite circle (blue) */}
        <svg
          className="absolute top-1/2 left-1/2 w-10 h-10 -translate-x-1/2 -translate-y-1/2 animate-spin-reverse"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke="#3B82F6"
            strokeWidth="4"
            strokeDasharray="28 28"
            strokeDashoffset="14"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default BottomSpinner;
