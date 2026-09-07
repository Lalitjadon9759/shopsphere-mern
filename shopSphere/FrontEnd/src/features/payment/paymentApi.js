import api from "../../api/axios";

// ======================================================
// Create Razorpay Order
// ======================================================

export const createPaymentOrder = async (orderId) => {
  const { data } = await api.post("/payments/create-order", {
    orderId,
  });

  return data;
};

// ======================================================
// Verify Payment
// ======================================================

export const verifyPayment = async (paymentData) => {
  const { data } = await api.post(
    "/payments/verify",
    paymentData
  );

  return data;
};

// ======================================================
// Get Payment Details
// ======================================================

export const getPayment = async (id) => {
  const { data } = await api.get(`/payments/${id}`);

  return data;
};