import removeItemService from "../services/removeItemService.js";

const removeItemController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const cart = await removeItemService(userId, productId);
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export default removeItemController;
