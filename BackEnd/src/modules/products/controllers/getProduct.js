import getProductService from "../services/getProductService.js";

const getProduct = async (req, res) => {
  try {
    const product = await getProductService(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default getProduct;
