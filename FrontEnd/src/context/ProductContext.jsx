import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);     // ✅ All products
  const [product, setProduct] = useState(null);     // ✅ Single product
  const [loading, setLoading] = useState(true);     // ✅ For loader
  const [error, setError] = useState(null);         // ✅ Error handling

  // ✅ Fetch all products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/products");
      setProducts(res.data);   // assuming API returns array of products
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch single product by ID
  const fetchProductById = async (id) => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/products/${id}`);
      setProduct(res.data);   // assuming API returns single product object
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch product");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch all products once on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        product,
        loading,
        error,
        fetchProducts,
        fetchProductById,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
