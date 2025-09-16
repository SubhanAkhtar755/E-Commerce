import clearCartService from "../services/clearCartService.js";

const clearCartController = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await clearCartService(userId);

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      data: cart,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

export default clearCartController;
