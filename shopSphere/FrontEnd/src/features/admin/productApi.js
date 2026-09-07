import api from "../../api/axios";

// ============================================
// Get All Products
// ============================================

export const getProducts = async (params = {}) => {
  const { data } = await api.get("/products", {
    params,
  });

  return data;
};

// ============================================
// Get Product By ID (Admin)
// ============================================

export const getProductById = async (id) => {
  const { data } = await api.get(`/products/admin/${id}`);

  return data;
};

// ============================================
// Create Product
// ============================================

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

// ============================================
// Update Product
// ============================================

export const updateProduct = async (id, formData) => {
  const { data } = await api.put(
    `/products/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

// ============================================
// Delete Product
// ============================================

export const deleteProduct = async (id) => {
  const { data } = await api.delete(`/products/${id}`);

  return data;
};