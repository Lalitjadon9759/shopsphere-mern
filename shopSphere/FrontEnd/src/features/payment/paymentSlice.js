import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import * as api from "./paymentApi";

// ============================================
// Create Payment Order
// ============================================

export const createOrder = createAsyncThunk(
  "payment/createOrder",
  async (orderId, thunkAPI) => {
    try {
      return await api.createPaymentOrder(orderId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Payment Failed"
      );
    }
  }
);

// ============================================
// Verify Payment
// ============================================

export const verifyOrder = createAsyncThunk(
  "payment/verify",
  async (paymentData, thunkAPI) => {
    try {
      return await api.verifyPayment(paymentData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Verification Failed"
      );
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",

  initialState: {
    loading: false,
    payment: null,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.payment = action.payload;
      })

      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(verifyOrder.pending, (state) => {
        state.loading = true;
      })

      .addCase(verifyOrder.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(verifyOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default paymentSlice.reducer;