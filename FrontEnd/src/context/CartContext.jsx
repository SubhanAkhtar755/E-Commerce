import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);

  // ✅ Fetch user cart
  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://e-commerce-h7o7.onrender.com/api/cart", {
        withCredentials: true,
      });
      setCart(res.data.cart?.items || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update quantity
  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      await axios.put(
        `https://e-commerce-h7o7.onrender.com/api/cart/update/${productId}`,
        { quantity },
        { withCredentials: true }
      );
      fetchCart();
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  // ✅ Remove single item
  const removeItem = async (productId) => {
    try {
      await axios.delete(
        `https://e-commerce-h7o7.onrender.com/api/cart/remove/${productId}`,
        { withCredentials: true }
      );
      fetchCart();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // ✅ Remove selected items
  const removeSelected = async () => {
    try {
      await Promise.all(
        selectedItems.map((id) =>
          axios.delete(`https://e-commerce-h7o7.onrender.com/api/cart/remove/${id}`, {
            withCredentials: true,
          })
        )
      );
      setSelectedItems([]);
      fetchCart();
    } catch (error) {
      console.error("Error removing selected items:", error);
    }
  };

  // ✅ Clear cart
  const clearCart = async () => {
    try {
      await axios.delete("https://e-commerce-h7o7.onrender.com/api/cart/clear", {
        withCredentials: true,
      });
      setCart([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };


  // ✅ Force clear cart locally (without backend call)
const resetCart = () => {
  setCart([]);
  setSelectedItems([]);
};


  // ✅ Checkbox toggle
  const toggleSelect = (productId) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        selectedItems,
        fetchCart,
        updateQuantity,
        removeItem,
        removeSelected,
        clearCart,
        toggleSelect,
        resetCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
