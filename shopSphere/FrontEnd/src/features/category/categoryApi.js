import api from "../../api/axios";

export const getCategories = async () => {
  const { data } = await api.get("/categories");
  return data;
};

export const createCategory = async (values) => {
  const { data } = await api.post("/categories", values);
  return data;
};

export const updateCategory = async (id, values) => {
  const { data } = await api.put(`/categories/${id}`, values);
  return data;
};

export const deleteCategory = async (id) => {
  const { data } = await api.delete(`/categories/${id}`);
  return data;
};