import createProductService from "../services/createProductService.js";

const createProduct = async (req, res) => {
  try {
    if (!req.body.name || !req.body.price || !req.body.category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const product = await createProductService(req.body, req.files);
    res.status(201).json(product);
  } catch (err) {
    console.error("CreateProduct Error:", err.message);
    res.status(500).json({ message: err.message });
  }
};

export default createProduct;
