import React, { useState, useEffect } from "react";
import { useDarkMode } from "../../context/DarkModeContext";
import { useUser } from "../../context/UserContext";
import { toast } from "react-toastify";

const Address = () => {
  const { darkMode } = useDarkMode();
  const { user, fetchUser } = useUser();

  const theme = darkMode
    ? {
        bg: "bg-[#111827]",
        text: "text-[#F9FAFB]",
        secondary: "text-[#9CA3AF]",
        border: "border-gray-700",
        card: "bg-[#1F2937] border-gray-700",
        input: "bg-[#1F2937] border-gray-600 text-[#F9FAFB]",
      }
    : {
        bg: "bg-[#F9FAFB]",
        text: "text-[#111827]",
        secondary: "text-[#4B5563]",
        border: "border-gray-300",
        card: "bg-white border-gray-200",
        input: "bg-white border-gray-300 text-[#111827]",
      };

  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  // ✅ fill from user context
  useEffect(() => {
    if (user?.address) {
      setFormData({
        street: user.address.street || "",
        city: user.address.city || "",
        state: user.address.state || "",
        postalCode: user.address.postalCode || "",
        country: user.address.country || "",
        phone: user.address.phone || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const toastId = toast.loading("Updating address...");
    try {
      // ✅ sirf address object bhej rahe hain
      const res = await fetch("https://e-commerce-h7o7.onrender.com/api/user/update-account", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ address: formData }),
      });

      if (!res.ok) throw new Error("Failed to update address");

      await fetchUser();

      toast.update(toastId, {
        render: "Address updated successfully 🎉",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      setIsEditing(false);
    } catch (err) {
      console.error(err);
      toast.update(toastId, {
        render: err.message || "Error updating address ❌",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <div
      className={`p-4 lg:mt-6 max-w-3xl mx-auto rounded-lg shadow ${theme.bg} ${theme.border}`}
    >
      <h2 className="text-xl font-semibold mb-6">Address</h2>

      <div className="grid  grid-cols-1 md:grid-cols-2 gap-4">
        {/* Street */}
        <div>
          <label className={`block text-sm mb-1 ${theme.secondary}`}>
            Street
          </label>
          <input
            type="text"
            name="street"
            disabled={!isEditing}
            value={formData.street}
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded-md border ${theme.input} focus:outline-none focus:ring-0 focus:border-current`}
          />
        </div>

        {/* City */}
        <div>
          <label className={`block text-sm mb-1 ${theme.secondary}`}>
            City & Chock
          </label>
          <input
            type="text"
            name="city"
            disabled={!isEditing}
            value={formData.city}
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded-md border ${theme.input} focus:outline-none focus:ring-0 focus:border-current`}
          />
        </div>

        {/* State */}
        <div>
          <label className={`block text-sm mb-1 ${theme.secondary}`}>
            State
          </label>
          <input
            type="text"
            name="state"
            disabled={!isEditing}
            value={formData.state}
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded-md border ${theme.input} focus:outline-none focus:ring-0 focus:border-current`}
          />
        </div>

        {/* Postal Code */}
        <div>
          <label className={`block text-sm mb-1 ${theme.secondary}`}>
            Postal Code
          </label>
          <input
            type="text"
            name="postalCode"
            disabled={!isEditing}
            value={formData.postalCode}
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded-md border ${theme.input} focus:outline-none focus:ring-0 focus:border-current`}
          />
        </div>

        {/* Country */}
        <div>
          <label className={`block text-sm mb-1 ${theme.secondary}`}>
            Country
          </label>
          <input
            type="text"
            name="country"
            disabled={!isEditing}
            value={formData.country}
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded-md border ${theme.input} focus:outline-none focus:ring-0 focus:border-current`}
          />
        </div>

        {/* Phone */}
        <div>
          <label className={`block text-sm mb-1 ${theme.secondary}`}>
            Phone
          </label>
          <input
            type="text"
            name="phone"
            disabled={!isEditing}
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded-md border ${theme.input} focus:outline-none focus:ring-0 focus:border-current`}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full sm:w-auto px-6 py-2 rounded-md bg-[#F59E0B] text-white font-semibold cursor-pointer"
          >
            Edit
          </button>
        ) : (
          <button
            onClick={handleUpdate}
            className="w-full sm:w-auto px-6 py-2 rounded-md bg-green-600 text-white font-semibold cursor-pointer"
          >
            Update
          </button>
        )}
      </div>
    </div>
  );
};

export default Address;
