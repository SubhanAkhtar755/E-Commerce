import getCartService from "../services/getCartService.js";

const getCartController = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await getCartService(userId);
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export default getCartController;
