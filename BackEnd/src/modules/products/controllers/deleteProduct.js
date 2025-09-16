import deleteProductService from "../services/deleteProductService.js";

const deleteProduct = async (req, res) => {
  try {
    await deleteProductService(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default deleteProduct;
