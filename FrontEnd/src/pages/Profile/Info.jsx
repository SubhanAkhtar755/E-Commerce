import React, { useState, useEffect, useRef } from "react";
import { useDarkMode } from "../../context/DarkModeContext";
import { useUser } from "../../context/UserContext";
import { toast } from "react-toastify";
import { FaUser, FaUserAlt, FaPen, FaCalendarAlt } from "react-icons/fa";

const Info = () => {
  const { darkMode } = useDarkMode();
  const { user, fetchUser } = useUser();
  const dateInputRef = useRef(null); // date input ref

  const theme = darkMode
    ? {
        bg: "bg-[#111827]",
        text: "text-[#F9FAFB]",
        secondary: "text-[#9CA3AF]",
        border: "border-gray-700",
        card: "bg-[#1F2937] border-gray-700",
        link: "hover:text-[#F59E0B]",
        input: "bg-[#1F2937] border-gray-600 text-[#F9FAFB]",
        selectText: "text-white",
      }
    : {
        bg: "bg-[#F9FAFB]",
        text: "text-[#111827]",
        secondary: "text-[#4B5563]",
        border: "border-gray-300",
        card: "bg-white border-gray-200",
        link: "hover:text-[#F59E0B]",
        input: "bg-white border-gray-300 text-[#111827]",
        selectText: "text-black",
      };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    birthday: "",
    gender: "",
    image: { url: "", public_id: "" },
    imageFile: null,
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        number: user.number || "",
        birthday: user.birthday ? user.birthday.slice(0, 10) : "",
        gender: user.gender || "",
        image: user.image || { url: "", public_id: "" },
        imageFile: null,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData((prev) => ({
      ...prev,
      imageFile: file,
      image: { ...prev.image, url: URL.createObjectURL(file) },
    }));
  };

  const handleUpdate = async () => {
    const toastId = toast.loading("Updating account...");
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("number", formData.number);
      data.append("birthday", formData.birthday);
      data.append("gender", formData.gender);

      if (formData.imageFile) {
        data.append("image", formData.imageFile);
      }

      const res = await fetch(
        "https://e-commerce-1-f4a7.onrender.com/api/user/update-account",
        {
          method: "PUT",
          credentials: "include",
          body: data,
        }
      );

      if (!res.ok) throw new Error("Failed to update");
      await fetchUser();

      toast.update(toastId, {
        render: "Account updated successfully 🎉",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      setIsEditing(false);
    } catch (error) {
      toast.update(toastId, {
        render: error.message || "Error updating account ❌",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  // Open date picker when wrapper clicked
  const handleDateWrapperClick = () => {
    if (dateInputRef.current && isEditing) {
      dateInputRef.current.showPicker?.(); // modern browsers
      dateInputRef.current.focus();
    }
  };

  return (
    <div className={`sm:p-6 min-h-screen ${theme.bg} ${theme.text}`}>
      <div
        className={`max-w-3xl mx-auto p-4 rounded-lg shadow ${theme.bg} ${theme.border}`}
      >
        <h2 className={`text-2xl font-semibold mb-6 ${theme.text}`}>
          Profile Information
        </h2>

        {/* Profile Image */}
        <div className="flex flex-col items-center mb-6">
          {formData.image?.url ? (
            <img
              src={formData.image.url}
              alt="Profile"
              className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover mb-2 transition ${
                isEditing ? "blur-[2px]" : ""
              }`}
            />
          ) : formData.gender === "female" ? (
            <FaUserAlt className="w-28 h-28 sm:w-32 sm:h-32 text-pink-500 border rounded-full p-2 mb-2" />
          ) : (
            <FaUser className="w-28 h-28 sm:w-32 sm:h-32 text-blue-500 border rounded-full p-2 mb-2" />
          )}

          {isEditing && (
            <div className="relative">
              <label htmlFor="imageUpload" className="cursor-pointer">
                <FaPen className="text-white bg-black/60 p-2 rounded-full w-10 h-10" />
              </label>
              <input
                id="imageUpload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageSelect}
              />
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm mb-1 ${theme.secondary}`}>Name</label>
            <input
              type="text"
              name="name"
              disabled={!isEditing}
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-md border ${theme.input} focus:outline-none focus:ring-0 focus:border-current`}
            />
          </div>

          <div>
            <label className={`block text-sm mb-1 ${theme.secondary}`}>Email</label>
            <input
              type="email"
              name="email"
              disabled
              value={formData.email}
              className={`w-full px-3 py-2 rounded-md border ${theme.input} bg-gray-200 text-gray-500 cursor-not-allowed focus:outline-none focus:ring-0 focus:border-current`}
            />
          </div>

          <div>
            <label className={`block text-sm mb-1 ${theme.secondary}`}>Phone Number</label>
            <input
              type="text"
              name="number"
              disabled={!isEditing}
              value={formData.number}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-md border ${theme.input} focus:outline-none focus:ring-0 focus:border-current`}
            />
          </div>

          {/* Date Picker */}
          <div>
            <label className={`block text-sm mb-1 ${theme.secondary}`}>Birthday</label>
            <div
              className="relative cursor-pointer"
              onClick={handleDateWrapperClick}
            >
              <input
                type="date"
                ref={dateInputRef}
                name="birthday"
                disabled={!isEditing}
                value={formData.birthday}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-md border ${theme.input} appearance-none focus:outline-none focus:ring-0 focus:border-current`}
              />
              <FaCalendarAlt
                className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                  darkMode ? "text-white" : "text-black"
                }`}
              />
            </div>
          </div>

          {/* Gender Select */}
          <div className="sm:col-span-2">
            <label className={`block text-sm mb-1 ${theme.secondary}`}>Gender</label>
            <select
              name="gender"
              disabled={!isEditing}
              value={formData.gender}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-md border ${theme.input} focus:outline-none focus:ring-0 focus:border-current ${theme.selectText}`}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
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
    </div>
  );
};

export default Info;
