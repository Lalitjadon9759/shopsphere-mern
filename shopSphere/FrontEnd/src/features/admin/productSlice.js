import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import * as api from "./productApi";

// ============================================
// Fetch Products
// ============================================

export const fetchProducts = createAsyncThunk(
  "admin/fetchProducts",
  async (params = {}, thunkAPI) => {
    try {
      return await api.getProducts(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

// ============================================
// Add Product
// ============================================

export const addProduct = createAsyncThunk(
  "admin/addProduct",
  async (formData, thunkAPI) => {
    try {
      const data = await api.createProduct(formData);

      thunkAPI.dispatch(fetchProducts());

      return data.product;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add product"
      );
    }
  }
);

// ============================================
// Delete Product
// ============================================

export const removeProduct = createAsyncThunk(
  "admin/deleteProduct",
  async (id, thunkAPI) => {
    try {
      await api.deleteProduct(id);

      thunkAPI.dispatch(fetchProducts());

      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete product"
      );
    }
  }
);

// ============================================
// Slice
// ============================================

const productSlice = createSlice({
  name: "adminProducts",

  initialState: {
    products: [],
    loading: false,
    totalPages: 1,
    currentPage: 1,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products || [];
        state.totalPages = action.payload.totalPages || 1;
        state.currentPage = action.payload.currentPage || 1;
      })

      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Product
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
      })

      .addCase(addProduct.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Product
      .addCase(removeProduct.pending, (state) => {
        state.loading = true;
      })

      .addCase(removeProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          (product) => product._id !== action.payload
        );
      })

      .addCase(removeProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;