import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useDarkMode } from "../../context/DarkModeContext.jsx";

const ReturnRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { darkMode } = useDarkMode();

  const [issue, setIssue] = useState("");
  const [reason, setReason] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const theme = darkMode
    ? {
        bg: "bg-[#111827]",
        text: "text-[#F9FAFB]",
        card: "bg-[#1F2937] border-gray-700",
        secondary: "text-gray-400",
        input: "bg-[#1F2937] text-[#F9FAFB] border-gray-600 focus:border-white focus:ring-0",
        placeholder: "placeholder-gray-400",
        cancelBtn: "bg-gray-700 text-white hover:bg-gray-600",
        submitBtn: "bg-blue-600 text-white hover:bg-blue-700",
      }
    : {
        bg: "bg-[#F9FAFB]",
        text: "text-[#111827]",
        card: "bg-white border-gray-200",
        secondary: "text-gray-600",
        input: "bg-white text-[#111827] border-gray-300 focus:border-black focus:ring-0",
        placeholder: "placeholder-gray-500",
        cancelBtn: "bg-gray-100 text-gray-700 hover:bg-gray-200",
        submitBtn: "bg-blue-600 text-white hover:bg-blue-700",
      };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 6) {
      toast.error("You can upload max 6 images.");
      return;
    }
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => setImages((prev) => [...prev, reader.result]);
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (idx) => setImages((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!issue) return toast.error("Please select an issue.");
    if (!reason) return toast.error("Please provide a reason for return.");

    try {
      setLoading(true);
      await axios.post(
        `/api/orders/${id}/return`,
        { issue, reason, images },
        { withCredentials: true }
      );
      toast.success("Return request submitted successfully!");
      navigate(`/orders/${id}/return-detail`);
    } catch (err) {
      toast.error("Failed: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex justify-center lg:p-6 sm:p-6 ${theme.bg} ${theme.text} min-h-screen`}>
      <div className={`w-full max-w-xl sm:max-w-2xl ${theme.card} shadow-lg rounded-xl p-6 sm:p-8`}>
        <h2 className="text-2xl font-bold mb-4 sm:mb-6 text-center">📦 Return Request</h2>
        <p className={`text-sm mb-4 sm:mb-6 text-center ${theme.secondary}`}>
          Order ID: <span className="font-medium">{id}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Issue Dropdown */}
          <div>
            <label className="block text-sm font-semibold mb-2">Select Issue</label>
            <select
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              className={`w-full rounded-lg p-3 border ${theme.input}`}
              required
            >
              <option value="" className={theme.placeholder}>-- Select an Issue --</option>
              <option value="Wrong item delivered">Wrong item delivered</option>
              <option value="Damaged or broken product">Damaged or broken product</option>
              <option value="Product not as described">Product not as described</option>
              <option value="Missing parts/accessories">Missing parts/accessories</option>
              <option value="Size/fit issue">Size/fit issue</option>
              <option value="Late delivery">Late delivery</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Reason Textarea */}
          <div>
            <label className="block text-sm font-semibold mb-2">Reason for Return</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows="4"
              placeholder="Explain the issue and (if refund approved) provide payment details."
              className={`w-full rounded-lg p-3 border ${theme.input} ${theme.placeholder} focus:outline-none`}
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold mb-2">Upload Images (max 6)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className={`w-full text-sm ${theme.text}`}
            />

            {images.length > 0 && (
              <div className="flex flex-wrap gap-2 sm:gap-4 mt-2 sm:mt-4">
                {images.map((img, idx) => (
                  <div key={idx} className="relative w-20 h-20 sm:w-24 sm:h-24 border rounded-lg shadow-sm overflow-hidden">
                    <img src={img} alt={`return-${idx}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full px-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 pt-2 sm:pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className={`px-5 py-2.5 rounded-lg ${theme.cancelBtn} w-full sm:w-auto`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-5 py-2.5 rounded-lg font-medium shadow ${theme.submitBtn} disabled:opacity-50 w-full sm:w-auto`}
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReturnRequest;
