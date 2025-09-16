import { Routes, Route, useLocation } from "react-router-dom";
import Home from "../pages/Home/Home";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import Footer2 from "../components/Footer/Footer2";
import AuthPage from "../pages/AuthPage/AuthPage";
import Shop from "../components/Navbar/List/Shop";
import About from "../components/Navbar/List/About";
import ProductsDetails from "../pages/ProductsDetails/ProductsDetails";
import CategoryPage from "../pages/CategoryPage/CategoryPage";
import Profile from "../pages/Profile/Profile";
import Info from "../pages/Profile/Info";
import Address from "../pages/Profile/Address";
import Orders from "../pages/Profile/Orders";
import Faqs from "../components/Footer/List/Faqs";
import PrivacyPolicy from "../components/Footer/List/PrivacyPolicy";
import TermsConditions from "../components/Footer/List/TermsConditions";
import SearchPage from "../pages/SearchPage/SearchPage";
import ScrollToTop from "../components/Important/ScrollToTop";
import Cart from "../components/Navbar/List/Cart";
import CheckOutPage from "../pages/CheckOutPage/CheckOutPage";
import PaymentOptionPage from "../pages/PaymentOptionPage/PaymentOptionPage";
import Dashboard from "../pages/Dashboard/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import ReturnRequest from "../pages/Profile/ReturnRequest";
import ReturnDetailsPage from "../pages/Profile/ReturnDetailsPage";
import OrderHistoryDetailsPage from "../pages/Profile/OrderHistoryDetailsPage";
import AllOrders from "../pages/Dashboard/AllOrders";
import AdminOrderDetails from "../pages/Dashboard/AdminOrderDetails";
import AdminOrderReturnedDetails from "../pages/Dashboard/AdminOrderReturnedDetails";
import ProductsAdd from "../pages/Dashboard/ProductsAdd";
import Products from "../pages/Dashboard/Products";
import AllUsers from "../pages/Dashboard/AllUsers";
import DashboardReports from "../pages/Dashboard/DashboardReports";

const AppRouter = () => {
  const location = useLocation();

  // current path
  const path = location.pathname.toLowerCase();

  // sirf Home pr Footer show hoga
  const isHome = path === "/";

  // abhi dashboard pr koi footer show nahi karna
  const isDashboard = path.startsWith("/dashboard");

  return (
    <>
      <ScrollToTop />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/AuthPage" element={<AuthPage />} />
        <Route path="/Shop" element={<Shop />} />
        <Route path="/About" element={<About />} />
        <Route path="/ProductsDetails/:id" element={<ProductsDetails />} />
        <Route path="/categories/:slug" element={<CategoryPage />} />
        <Route path="/faqs" element={<Faqs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsConditions />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<CheckOutPage />} />
        <Route path="/PaymentSend" element={<PaymentOptionPage />} />
      

        {/* Order return (dynamic id) */}
        <Route path="/orders/:id/return" element={<ReturnRequest />} />
        <Route
          path="/orders/:id/return-detail"
          element={<ReturnDetailsPage />}
        />
        <Route
          path="/orders/:id/history-detail"
          element={<OrderHistoryDetailsPage />}
        />

        {/* 🔒 Protected Dashboard */}
        <Route
          path="/Dashboard"
          element={
            <ProtectedRoute adminOnly={true}>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route path="orders/all" element={<AllOrders />} />
          <Route path="admin/orders/:id" element={<AdminOrderDetails />} />
          <Route path="admin/orders/returned/:id" element={<AdminOrderReturnedDetails />} />
          <Route path="add" element={<ProductsAdd />} />
          <Route path="products/edit/:id" element={<ProductsAdd editMode={true} />} />
          <Route path="products" element={<Products />} />
          <Route path="users" element={<AllUsers />} />
          <Route path="reports" element={<DashboardReports />} />
        </Route>

        {/* 🔒 Protected Profile routes */}
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        >
          <Route path="info" element={<Info />} />
          <Route path="address" element={<Address />} />
          <Route path="orders" element={<Orders />} />
        </Route>
      </Routes>

      {/* ✅ conditionally render footer */}
      {isHome && <Footer />}
      {!isHome  && <Footer2 />}
    </>
  );
};

export default AppRouter;
