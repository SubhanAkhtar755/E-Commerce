import updateCartService from "../services/updateCartService.js";

const updateCartController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;

    const cart = await updateCartService(userId, productId, quantity);
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export default updateCartController;
