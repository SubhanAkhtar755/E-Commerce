import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);

  const [usersCount, setUsersCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);

  const [stats, setStats] = useState({
    netRevenue: 0,
    totalReturnedCount: 0,
    returnedCompletedCount: 0,
    returnedRejectedCount: 0,
    totalCompletedOrders: 0,
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // 🔹 All Users
      const usersRes = await axios.get("http://localhost:4001/api/user/all-users", { withCredentials: true });
    

      // 🔹 All Products
      const productsRes = await axios.get("http://localhost:4001/api/products", { withCredentials: true });

      // 🔹 Revenue & Returns
      const revenueRes = await axios.get("http://localhost:4001/api/orders/revenue/cod", { withCredentials: true });

      setUsersCount(usersRes.data?.length ?? 0);
      setProductsCount(productsRes.data?.length ?? 0);

      setStats({
        netRevenue: revenueRes.data?.netRevenue ?? 0,
        totalReturnedCount: revenueRes.data?.totalReturnedCount ?? 0,
        returnedCompletedCount: revenueRes.data?.returnedCompletedCount ?? 0,
        returnedRejectedCount: revenueRes.data?.returnedRejectedCount ?? 0,
        totalCompletedOrders: revenueRes.data?.totalCompletedOrders ?? 0,
        deliveredOrdersCount: revenueRes.data?.deliveredOrdersCount ?? 0,
      });

    } catch (error) {
      console.error("Dashboard data fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        loading,
        usersCount,
        productsCount,
        stats,
        fetchDashboardData, // manual refresh button ke liye expose kar diya
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);
