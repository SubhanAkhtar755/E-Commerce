import React from "react";
import {
  Users,
  ShoppingCart,
  Package,
  DollarSign,
  RotateCcw,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useDashboard } from "../../context/DashboardContext";
import { useDarkMode } from "../../context/DarkModeContext";
import SpinnerOverlay from "../../components/Important/SpinnerOverlay";

const DashboardReports = () => {
  const { loading, usersCount, productsCount, stats } = useDashboard();
  const { darkMode } = useDarkMode();

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

  if (loading) return <SpinnerOverlay />;

  return (
    <div className={`pt-5 space-y-10 ${theme.bg} min-h-screen`}>
      {/* Page Title */}
      <h1 className={`text-3xl font-bold mb-6 ${theme.text}`}>
        📊 Dashboard Overview
      </h1>

      {/* Bottom Full Width Revenue Card */}
      <div
        className={`${theme.card} p-6 rounded-lg shadow-lg flex items-center justify-between mt-6 `}
      >
        <div>
          <h2 className={`text-lg font-semibold ${theme.secondary}`}>
            Net Revenue
          </h2>
          <p className={`text-3xl font-bold mt-2 ${theme.text}`}>
            RS {stats.netRevenue}
          </p>
        </div>
        <DollarSign className="text-green-500 w-8 h-8" />
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 m-1">
        <StatCard
          title="Users"
          value={usersCount}
          icon={<Users className="text-blue-500 w-6 h-6" />}
          color="blue"
          theme={theme}
        />
        <StatCard
          title="Orders"
          value={stats.totalCompletedOrders}
          icon={<ShoppingCart className="text-purple-500 w-6 h-6" />}
          color="purple"
          theme={theme}
        />
        <StatCard
          title="Delivered Orders"
          value={stats.deliveredOrdersCount}
          icon={<ShoppingCart className="text-green-500 w-6 h-6" />}
          color="green"
          theme={theme}
        />
        <StatCard
          title="Products"
          value={productsCount}
          icon={<Package className="text-yellow-500 w-6 h-6" />}
          color="yellow"
          theme={theme}
        />
      </div>

      {/* Returns & Completion Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6 m-1">
        <StatusCard
          title="Returned Orders"
          value={stats.totalReturnedCount}
          icon={<RotateCcw className="text-orange-500 w-6 h-6" />}
          theme={theme}
        />
        <StatusCard
          title="Completed Returns"
          value={stats.returnedCompletedCount}
          icon={<CheckCircle2 className="text-green-500 w-6 h-6" />}
          theme={theme}
        />
        <StatusCard
          title="Rejected Returns"
          value={stats.returnedRejectedCount}
          icon={<XCircle className="text-red-500 w-6 h-6" />}
          theme={theme}
        />
      </div>
    </div>
  );
};

// Top Stat Card
const StatCard = ({ title, value, icon, color, theme }) => (
  <div
    className={`${theme.card} p-6 rounded-lg shadow-md hover:shadow-xl transition transform hover:-translate-y-1 duration-300 flex flex-col justify-between`}
  >
    <div className="flex items-center justify-between">
      <h2 className={`text-sm font-medium ${theme.secondary}`}>{title}</h2>
      {icon}
    </div>
    <p className={`text-3xl font-bold mt-4 ${theme.text}`}>{value}</p>
    <p className={`text-xs text-${color}-500 mt-1`}>
      {title.includes("Users")
        ? "+ Active Users"
        : title.includes("Orders")
        ? "+ Total Orders"
        : "+ Inventory"}
    </p>
  </div>
);

// Status Card
const StatusCard = ({ title, value, icon, theme }) => (
  <div
    className={`${theme.card} p-6 rounded-2xl shadow-md flex items-center justify-between h-40`}
  >
    <div>
      <h2 className={`text-sm font-medium ${theme.secondary}`}>{title}</h2>
      <p className={`text-2xl font-bold mt-2 ${theme.text}`}>{value}</p>
    </div>
    {icon}
  </div>
);

export default DashboardReports;
