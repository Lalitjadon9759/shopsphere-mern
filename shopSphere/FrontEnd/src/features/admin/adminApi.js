import api from "../../api/axios";

// ======================================================
// Dashboard
// ======================================================

export const getDashboard = async () => {
  const { data } = await api.get(
    "/admin/dashboard"
  );

  return data;
};

export const getStatistics = async () => {
  const { data } = await api.get(
    "/admin/statistics"
  );

  return data;
};

export const getRecentOrders = async () => {
  const { data } = await api.get(
    "/admin/recent-orders"
  );

  return data;
};

export const getMonthlySales = async () => {
  const { data } = await api.get(
    "/admin/monthly-sales"
  );

  return data;
};

export const getTopProducts = async () => {
  const { data } = await api.get(
    "/admin/top-products"
  );

  return data;
};

// ======================================================
// Product
// ======================================================

export const createProduct = async (formData) => {
  const { data } = await api.post(
    "/products",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

// ======================================================
// Categories
// ======================================================

export const getCategories = async () => {
  const { data } = await api.get(
    "/categories"
  );

  return data;
};

// ======================================================
// Reviews - Admin
// ======================================================

// Get all reviews
export const getAllReviews = async () => {
  const { data } = await api.get(
    "/reviews"
  );

  return data;
};

// Approve / Reject review
export const toggleReviewStatus = async (id) => {
  const { data } = await api.patch(
    `/reviews/${id}/toggle`
  );

  return data;
};