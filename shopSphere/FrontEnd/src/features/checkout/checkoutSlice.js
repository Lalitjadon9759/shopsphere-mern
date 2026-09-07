import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as checkoutApi from "./checkoutApi";

export const placeOrder = createAsyncThunk(
  "checkout/placeOrder",
  async (data, thunkAPI) => {
    try {
      return await checkoutApi.createOrder(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to place order"
      );
    }
  }
);

const checkoutSlice = createSlice({
  name: "checkout",

  initialState: {
    loading: false,
    order: null,
    error: null,
  },

  reducers: {
    clearCheckout(state) {
      state.order = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
      })

      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload.order;
      })

      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCheckout } = checkoutSlice.actions;

export default checkoutSlice.reducer;