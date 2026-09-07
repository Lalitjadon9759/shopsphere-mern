import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as cartApi from "./cartApi";

const initialState = {
  cart: null,
  loading: false,
  error: null,
};

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, thunkAPI) => {
    try {
      return await cartApi.getCart();
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to load cart"
      );
    }
  }
);

export const addItem = createAsyncThunk(
  "cart/addItem",
  async (data, thunkAPI) => {
    try {
      return await cartApi.addToCart(data);
    } catch (err) {
      console.error("Add to cart API error:", err);

      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Add to cart failed"
      );
    }
  }
);

export const updateItem = createAsyncThunk(
  "cart/updateItem",
  async (data, thunkAPI) => {
    try {
      return await cartApi.updateCartItem(data);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Update failed"
      );
    }
  }
);

export const removeItem = createAsyncThunk(
  "cart/removeItem",
  async (productId, thunkAPI) => {
    try {
      return await cartApi.removeCartItem(productId);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Remove failed"
      );
    }
  }
);

export const clearUserCart = createAsyncThunk(
  "cart/clearCart",
  async (_, thunkAPI) => {
    try {
      return await cartApi.clearCart();
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Clear cart failed"
      );
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      // =========================
      // FETCH CART
      // =========================

      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.cart = action.payload.cart;
      })

      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // =========================
      // ADD ITEM
      // =========================

      .addCase(addItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(addItem.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.cart = action.payload.cart;
      })

      .addCase(addItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // =========================
      // UPDATE ITEM
      // =========================

      .addCase(updateItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateItem.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.cart = action.payload.cart;
      })

      .addCase(updateItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // =========================
      // REMOVE ITEM
      // =========================

      .addCase(removeItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(removeItem.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.cart = action.payload.cart;
      })

      .addCase(removeItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // =========================
      // CLEAR CART
      // =========================

      .addCase(clearUserCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(clearUserCart.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.cart = action.payload.cart;
      })

      .addCase(clearUserCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;