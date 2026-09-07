import api from "../../api/axios";


// ======================================================
// Create Order
// ======================================================

export const createOrder = async (orderData) => {

  const { data } = await api.post(
    "/orders",
    orderData
  );

  return data;

};



// ======================================================
// Get Logged-in User Orders
// ======================================================

export const getMyOrders = async () => {

  const { data } = await api.get(
    "/orders/my-orders"
  );

  return data;

};



// ======================================================
// Get Single Order
// ======================================================

export const getOrderById = async (id) => {

  const { data } = await api.get(
    `/orders/${id}`
  );

  return data;

};



// ======================================================
// Cancel Order
// ======================================================

export const cancelOrder = async (id) => {

  const { data } = await api.patch(
    `/orders/cancel/${id}`
  );

  return data;

};