import api from "../../api/axios";

// GET CART
export const getCart = async () => {
  const res = await api.get("/cart");
  return res.data;
};

// ADD ITEM
export const addToCart = async (data) => {
  const res = await api.post("/cart", data);
  return res.data;
};

// UPDATE QUANTITY
export const updateCartItem = async ({ productId, quantity }) => {
  const res = await api.patch(`/cart/${productId}`, {
    quantity,
  });

  return res.data;
};

// REMOVE ITEM
export const removeCartItem = async (productId) => {
  const res = await api.delete(`/cart/${productId}`);
  return res.data;
};

// CLEAR CART
export const clearCart = async () => {
  const res = await api.delete("/cart");
  return res.data;
};