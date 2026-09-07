import api from "../../api/axios";

// Get Reviews of Product
export const getReviews = async (productId) => {
  const { data } = await api.get(`/reviews/product/${productId}`);
  return data;
};

// Create Review
export const createReview = async (values) => {
  const { data } = await api.post("/reviews", values);
  return data;
};

// Update Review
export const updateReview = async (id, values) => {
  const { data } = await api.put(`/reviews/${id}`, values);
  return data;
};

// Delete Review
export const deleteReview = async (id) => {
  const { data } = await api.delete(`/reviews/${id}`);
  return data;
};