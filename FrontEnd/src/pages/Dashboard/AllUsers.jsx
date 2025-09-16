// 📂 pages/AllUsers.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { User, Mail, Calendar } from "lucide-react";
import { useDarkMode } from "../../context/DarkModeContext";
import SpinnerOverlay from "../../components/Important/SpinnerOverlay.jsx";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const { darkMode } = useDarkMode();

  // 🎨 Theme object
  const theme = darkMode
    ? {
        bg: "bg-[#111827]",
        text: "text-[#F9FAFB]",
        secondary: "text-[#9CA3AF]",
        border: "border-gray-700",
        card: "bg-[#1F2937] border border-gray-700",
        link: "hover:text-[#F59E0B]",
        input: "bg-[#1F2937] border border-gray-600 text-[#F9FAFB]",
        selectText: "text-white",
      }
    : {
        bg: "bg-[#F9FAFB]",
        text: "text-[#111827]",
        secondary: "text-[#4B5563]",
        border: "border-gray-300",
        card: "bg-white border border-gray-200",
        link: "hover:text-[#F59E0B]",
        input: "bg-white border border-gray-300 text-[#111827]",
        selectText: "text-black",
      };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4001/api/user/all-users",
          {
            withCredentials: true,
          }
        );
        setUsers(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching users:", err);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  if (loading) return <SpinnerOverlay />;

  return (
    <div className={`p-4  ${theme.bg}`}>
      <h2 className={`text-3xl font-extrabold mb-8 text-center ${theme.text}`}>
        👥 All Users
      </h2>

      {users.length === 0 ? (
        <p className={`${theme.secondary} text-center`}>No users found</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {users.map((user, index) => (
            <div
              key={user._id}
              className={`relative rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 group overflow-hidden ${theme.card}`}
            >
              {/* Gradient border top */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>

              <div className="p-6">
                {/* Avatar circle */}
                <div className="flex items-center justify-center mb-4">
                  <div
                    className={`w-16 h-16 rounded-full bg-gradient-to-tr ${
                      darkMode ? "bg-[#F9FAFB]" : "bg-[#1F2937]"
                    } flex items-center justify-center shadow-inner group-hover:scale-105 transition`}
                  >
                    <User
                      className={darkMode ? "text-black" : "text-white"}
                      size={28}
                    />
                  </div>
                </div>

                {/* Name & Index */}
                <h3
                  className={`text-xl font-semibold text-center ${theme.text}`}
                >
                  {user.name || "N/A"}
                </h3>
                <p className={`text-xs text-center mb-4 ${theme.secondary}`}>
                  User #{index + 1}
                </p>

                {/* Info */}
                <div className="space-y-2 text-sm">
                  <div className={`flex items-center gap-2 ${theme.text}`}>
                    <Mail
                      size={16}
                      className={darkMode ? "text-blue-400" : "text-blue-500"}
                    />
                    <span className="truncate">{user.email}</span>
                  </div>

                  <div className={`flex items-center gap-2 ${theme.text}`}>
                    <Calendar
                      size={16}
                      className={
                        darkMode ? "text-purple-400" : "text-purple-500"
                      }
                    />
                    <span>
                      {new Date(user.createdAt).toLocaleDateString("en-GB")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllUsers;
