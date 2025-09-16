import updateProductService from "../services/updateProductService.js";

export const updateProduct = async (req, res) => {
  try {
    const product = await updateProductService(req.params.id, req.body, req.files);
    res.status(200).json({ message: "Product updated successfully", product });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


export default updateProduct;
