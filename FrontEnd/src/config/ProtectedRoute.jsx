import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import SpinnerOverlay from "../components/Important/SpinnerOverlay"; // import spinner

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useUser();

  // Show spinner while loading
  if (loading) {
    return <SpinnerOverlay show={true} />;
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/AuthPage" replace />;
  }

  // Admin/Dashboard access only
  if (adminOnly && user.email !== "muhammadsubhan192128@gmail.com") {
    return <Navigate to="/" replace />; // redirect to home if not admin
  }

  return children;
};

export default ProtectedRoute;
