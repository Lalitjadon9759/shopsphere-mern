import api from "../../api/axios";

export const getWishlist = async () => {
  const { data } = await api.get("/wishlist");
  return data;
};

export const addToWishlist = async (productId) => {
  const { data } = await api.post("/wishlist", {
    productId,
  });

  return data;
};

export const removeFromWishlist = async (productId) => {
  const { data } = await api.delete(
    `/wishlist/${productId}`
  );

  return data;
};

export const clearWishlist = async () => {
  const { data } = await api.delete("/wishlist");
  return data;
};