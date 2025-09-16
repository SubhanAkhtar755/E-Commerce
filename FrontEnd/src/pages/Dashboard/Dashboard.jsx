// 📂 pages/Admin/Dashboard.jsx
import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useDarkMode } from "../../context/DarkModeContext";
import { ChevronDown, ChevronUp } from "lucide-react";

const Dashboard = () => {
  const { darkMode } = useDarkMode();

  const theme = darkMode
    ? {
        bg: "bg-[#111827]",
        text: "text-[#F9FAFB]",
        secondary: "text-[#9CA3AF]",
        border: "border-gray-700",
        card: "bg-[#1F2937] border-gray-700",
        link: "hover:text-[#F59E0B]",
      }
    : {
        bg: "bg-[#F9FAFB]",
        text: "text-[#111827]",
        secondary: "text-[#4B5563]",
        border: "border-gray-300",
        card: "bg-white border-gray-200",
        link: "hover:text-[#F59E0B]",
      };

  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const handleLinkClick = () => {
    setOpenMenu(null);
  };

  return (
    <div className={`flex flex-col md:flex-row min-h-screen ${theme.bg} ${theme.text}`}>
      {/* 🔹 Mobile Dropdown Navbar */}
      <div className="md:hidden p-4 border-b shadow-sm">
        <div className="flex flex-wrap gap-6">
          {/* Analytics */}
          <div className="flex-1">
            <button
              className="flex justify-between items-center w-full py-2 font-semibold"
              onClick={() => toggleMenu("analytics")}
            >
              Analytics
              {openMenu === "analytics" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {openMenu === "analytics" && (
              <ul className="pl-4 space-y-2 mt-2">
                <li>
                  <NavLink
                    to="reports"
                    onClick={handleLinkClick}
                    className={({ isActive }) =>
                      `block py-1 transition ${
                        isActive
                          ? "text-[#F59E0B] font-semibold"
                          : `${theme.link} ${theme.secondary}`
                      }`
                    }
                  >
                    Dashboard
                  </NavLink>
                </li>
              </ul>
            )}
          </div>

          {/* Orders */}
          <div className="flex-1">
            <button
              className="flex justify-between items-center w-full py-2 font-semibold"
              onClick={() => toggleMenu("orders")}
            >
              Orders
              {openMenu === "orders" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {openMenu === "orders" && (
              <ul className="pl-4 space-y-2 mt-2">
                <li>
                  <NavLink
                    to="orders/all"
                    onClick={handleLinkClick}
                    className={({ isActive }) =>
                      `block py-1 transition ${
                        isActive
                          ? "text-[#F59E0B] font-semibold"
                          : `${theme.link} ${theme.secondary}`
                      }`
                    }
                  >
                    All Orders
                  </NavLink>
                </li>
              </ul>
            )}
          </div>

          {/* Products */}
          <div className="flex-1">
            <button
              className="flex justify-between items-center w-full py-2 font-semibold"
              onClick={() => toggleMenu("products")}
            >
              Products
              {openMenu === "products" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {openMenu === "products" && (
              <ul className="pl-4 space-y-2 mt-2">
                <li>
                  <NavLink
                    to="products"
                    onClick={handleLinkClick}
                    className={({ isActive }) =>
                      `block py-1 transition ${
                        isActive
                          ? "text-[#F59E0B] font-semibold"
                          : `${theme.link} ${theme.secondary}`
                      }`
                    }
                  >
                    All Products
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="add"
                    onClick={handleLinkClick}
                    className={({ isActive }) =>
                      `block py-1 transition ${
                        isActive
                          ? "text-[#F59E0B] font-semibold"
                          : `${theme.link} ${theme.secondary}`
                      }`
                    }
                  >
                    Add Product
                  </NavLink>
                </li>
              </ul>
            )}
          </div>

          {/* Users */}
          <div className="flex-1">
            <button
              className="flex justify-between items-center w-full py-2 font-semibold"
              onClick={() => toggleMenu("users")}
            >
              Users
              {openMenu === "users" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {openMenu === "users" && (
              <ul className="pl-4 space-y-2 mt-2">
                <li>
                  <NavLink
                    to="users"
                    onClick={handleLinkClick}
                    className={({ isActive }) =>
                      `block py-1 transition ${
                        isActive
                          ? "text-[#F59E0B] font-semibold"
                          : `${theme.link} ${theme.secondary}`
                      }`
                    }
                  >
                    All Users
                  </NavLink>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* 🔹 Desktop Sidebar */}
      <aside className={`w-64 p-5 hidden md:block ${theme.bg}`}>
        <h2 className="text-lg font-semibold mb-4">Analytics</h2>
        <ul className="space-y-2">
          <li>
            <NavLink
              to="reports"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md transition ${
                  isActive
                    ? "bg-[#F59E0B] text-white font-semibold"
                    : `${theme.link} ${theme.secondary}`
                }`
              }
            >
              Dashboard
            </NavLink>
          </li>
        </ul>

        <h2 className="text-lg font-semibold mt-6 mb-4">Orders</h2>
        <ul className="space-y-2">
          <li>
            <NavLink
              to="orders/all"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md transition ${
                  isActive
                    ? "bg-[#F59E0B] text-white font-semibold"
                    : `${theme.link} ${theme.secondary}`
                }`
              }
            >
              All Orders
            </NavLink>
          </li>
        </ul>

        <h2 className="text-lg font-semibold mt-6 mb-4">Products</h2>
        <ul className="space-y-2">
          <li>
            <NavLink
              to="products"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md transition ${
                  isActive
                    ? "bg-[#F59E0B] text-white font-semibold"
                    : `${theme.link} ${theme.secondary}`
                }`
              }
            >
              All Products
            </NavLink>
          </li>
          <li>
            <NavLink
              to="add"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md transition ${
                  isActive
                    ? "bg-[#F59E0B] text-white font-semibold"
                    : `${theme.link} ${theme.secondary}`
                }`
              }
            >
              Add Product
            </NavLink>
          </li>
        </ul>

        <h2 className="text-lg font-semibold mt-6 mb-4">Users</h2>
        <ul className="space-y-2">
          <li>
            <NavLink
              to="users"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md transition ${
                  isActive
                    ? "bg-[#F59E0B] text-white font-semibold"
                    : `${theme.link} ${theme.secondary}`
                }`
              }
            >
              All Users
            </NavLink>
          </li>
        </ul>
      </aside>

      {/* 🔹 Content */}
      <main className={`flex-1 ${theme.bg}`}>
        <div className={` ${theme.bg} rounded-lg`}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
