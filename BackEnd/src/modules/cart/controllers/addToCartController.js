import addToCartService from "../services/addToCartService.js";

const addToCartController = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { productId, quantity } = req.body;

    // ✅ Validate input
    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "ProductId and quantity are required",
      });
    }

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0",
      });
    }

    // ✅ Call service
    const cart = await addToCartService(userId, productId, quantity);

    return res.status(200).json({
      success: true,
      message: "Item added to cart successfully",
      data: cart,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

export default addToCartController;
