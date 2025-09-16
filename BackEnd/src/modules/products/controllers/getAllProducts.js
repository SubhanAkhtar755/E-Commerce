import getAllProductsService from "../services/getAllProductsService.js";

const getAllProducts = async (req, res) => {
  try {
    const products = await getAllProductsService();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default getAllProducts;
