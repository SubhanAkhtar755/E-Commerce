import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useDarkMode } from "../../context/DarkModeContext";
import { ChevronDown, ChevronUp } from "lucide-react";
import Footer2 from "../../components/Footer/Footer2";

const Profile = () => {
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

  const [openMenu, setOpenMenu] = useState(null); // track which dropdown is open

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  // helper to close dropdown on link click
  const handleLinkClick = () => {
    setOpenMenu(null);
  };

  return (
    <div className={`flex flex-col md:flex-row min-h-screen ${theme.bg} ${theme.text}`}>
      {/* Mobile Dropdown Menu */}
      <div className="md:hidden p-4 border-b shadow-sm">
        <div className="flex space-x-6">
          {/* My Account */}
          <div className="flex-1">
            <button
              className="flex justify-between items-center w-full py-2 font-semibold"
              onClick={() => toggleMenu("account")}
            >
              My Account
              {openMenu === "account" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {openMenu === "account" && (
              <ul className="pl-4 space-y-2 mt-2">
                <li>
                  <NavLink
                    to="info"
                    onClick={handleLinkClick}
                    className={({ isActive }) =>
                      `block py-1 transition ${
                        isActive
                          ? "text-[#F59E0B] font-semibold"
                          : `${theme.link} ${theme.secondary}`
                      }`
                    }
                  >
                    Profile Information
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="address"
                    onClick={handleLinkClick}
                    className={({ isActive }) =>
                      `block py-1 transition ${
                        isActive
                          ? "text-[#F59E0B] font-semibold"
                          : `${theme.link} ${theme.secondary}`
                      }`
                    }
                  >
                    Address Book
                  </NavLink>
                </li>
              </ul>
            )}
          </div>

          {/* My Orders */}
          <div className="flex-1">
            <button
              className="flex justify-between items-center w-full py-2 font-semibold"
              onClick={() => toggleMenu("orders")}
            >
              My Orders
              {openMenu === "orders" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {openMenu === "orders" && (
              <ul className="pl-4 space-y-2 mt-2">
                <li>
                  <NavLink
                    to="orders"
                    onClick={handleLinkClick}
                    className={({ isActive }) =>
                      `block py-1 transition ${
                        isActive
                          ? "text-[#F59E0B] font-semibold"
                          : `${theme.link} ${theme.secondary}`
                      }`
                    }
                  >
                    Orders
                  </NavLink>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className={`w-64 p-5  ${theme.bg}  hidden md:block`}>
        <h2 className="text-lg font-semibold mb-4">My Account</h2>
        <ul className="space-y-2">
          <li>
            <NavLink
              to="info"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md transition ${
                  isActive
                    ? "bg-[#F59E0B] text-white font-semibold"
                    : `${theme.link} ${theme.secondary}`
                }`
              }
            >
              Profile Information
            </NavLink>
          </li>
          <li>
            <NavLink
              to="address"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md transition ${
                  isActive
                    ? "bg-[#F59E0B] text-white font-semibold"
                    : `${theme.link} ${theme.secondary}`
                }`
              }
            >
              Address Book
            </NavLink>
          </li>
         
        </ul>

        <h2 className="text-lg font-semibold mt-6 mb-4">My Orders</h2>
        <ul className="space-y-2">
          <li>
            <NavLink
              to="orders"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md transition ${
                  isActive
                    ? "bg-[#F59E0B] text-white font-semibold"
                    : `${theme.link} ${theme.secondary}`
                }`
              }
            >
              Orders
            </NavLink>
          </li>
         
        </ul>
      </aside>

      {/* Content Area */}
      <main className={`flex-1  ${theme.bg}`}>
        <div className={` ${theme.bg}`}>
          <Outlet />
        </div>
      </main>
      
    </div>
  );
};  

export default Profile;
