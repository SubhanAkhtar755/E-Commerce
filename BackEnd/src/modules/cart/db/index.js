import Cart from "../models/index.js";

// ✅ Get user cart
const getUserCart = async (userId) => {
  if (!userId) return null;
  return await Cart.findOne({ userId });
};

// ✅ Add or update product in cart
const addOrUpdateCart = async (userId, item) => {
  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({ userId, items: [item] });
  } else {
    const index = cart.items.findIndex(
      (i) => i.productId.toString() === item.productId.toString()
    );

    if (index > -1) {
      // Product already in cart → update quantity + price fields
      cart.items[index].quantity += item.quantity;
      cart.items[index].price = item.price;
      cart.items[index].discountPrice = item.discountPrice;
    } else {
      // New product → push
      cart.items.push(item);
    }
  }

  return await cart.save();
};

// ✅ Update quantity of specific product
const updateCartItem = async (userId, productId, quantity) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) return null;

  const index = cart.items.findIndex(
    (i) => i.productId.toString() === productId.toString()
  );

  if (index > -1) {
    if (quantity <= 0) {
      cart.items.splice(index, 1); // remove item
    } else {
      cart.items[index].quantity = quantity;
    }
    return await cart.save();
  }

  return null;
};

// ✅ Remove product from cart
const removeCartItem = async (userId, productId) => {
  const cart = await Cart.findOne({ userId });
  if (!cart) return null;

  cart.items = cart.items.filter(
    (i) => i.productId.toString() !== productId.toString()
  );

  return await cart.save();
};

// ✅ Clear entire cart
const clearCart = async (userId) => {
  return await Cart.findOneAndUpdate(
    { userId },
    { $set: { items: [] } },
    { new: true }
  );
};

export {
  getUserCart,
  addOrUpdateCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};
