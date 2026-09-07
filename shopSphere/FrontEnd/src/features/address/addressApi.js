import api from "../../api/axios";

// Get all addresses
export const getAddresses = async () => {
  const response = await api.get("/addresses");
  return response.data;
};

// Get single address
export const getAddress = async (id) => {
  const response = await api.get(`/addresses/${id}`);
  return response.data;
};

// Create address
export const createAddress = async (data) => {
  const response = await api.post("/addresses", data);
  return response.data;
};

// Update address
export const updateAddress = async ({ id, data }) => {
  const response = await api.put(`/addresses/${id}`, data);
  return response.data;
};

// Delete address
export const deleteAddress = async (id) => {
  const response = await api.delete(`/addresses/${id}`);
  return response.data;
};

// Set default address
export const setDefaultAddress = async (id) => {
  const response = await api.patch(`/addresses/${id}/default`);
  return response.data;
};