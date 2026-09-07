import api from "../../api/axios";

// ======================================================
// Get All Products
// ======================================================

export const getProducts = async (params = {}) => {
  const { data } = await api.get("/products", {
    params: {
      page: params.page || 1,
      limit: params.limit || 8,
      search: params.search || "",
      category: params.category || "",
      minPrice: params.minPrice || "",
      maxPrice: params.maxPrice || "",
      sort: params.sort || "latest",
    },
  });

  return data;
};

// ======================================================
// Get Featured Products
// ======================================================

export const getFeaturedProducts = async () => {
  const { data } = await api.get("/products/featured");

  return data;
};

// ======================================================
// Get Product By Slug
// ======================================================

export const getProductBySlug = async (slug) => {
  const { data } = await api.get(`/products/${slug}`);

  return data;
};

// ======================================================
// Get Related Products
// ======================================================

export const getRelatedProducts = async (id) => {
  const { data } = await api.get(`/products/related/${id}`);

  return data;
};