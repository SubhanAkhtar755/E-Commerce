import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await axios.get("https://e-commerce-1-f4a7.onrender.com/api/user/my-profile", {
        withCredentials: true,
      });
      setUser(res.data.user);
    } catch (err) {
      // ✅ Unauthorized -> guest, so setUser(null)
      if (err.response?.status !== 401) {
        console.error("Fetch user error:", err);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, fetchUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
