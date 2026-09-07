import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import * as productApi from "./productApi";

// ======================================================
// Initial State
// ======================================================

const initialState = {
  products: [],

  featuredProducts: [],

  relatedProducts: [],

  currentProduct: null,

  loading: false,

  error: null,

  pagination: {
    page: 1,
    limit: 8,
    totalPages: 1,
    totalProducts: 0,
  },
};

// ======================================================
// Fetch All Products
// ======================================================

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",

  async (params = {}, thunkAPI) => {
    try {
      return await productApi.getProducts(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch products"
      );
    }
  }
);

// ======================================================
// Fetch Featured Products
// ======================================================

export const fetchFeaturedProducts = createAsyncThunk(
  "products/fetchFeaturedProducts",

  async (_, thunkAPI) => {
    try {
      return await productApi.getFeaturedProducts();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch featured products"
      );
    }
  }
);

// ======================================================
// Fetch Product By Slug
// ======================================================

export const fetchProductBySlug = createAsyncThunk(
  "products/fetchProductBySlug",

  async (slug, thunkAPI) => {
    try {
      return await productApi.getProductBySlug(slug);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Product not found"
      );
    }
  }
);

// ======================================================
// Fetch Related Products
// ======================================================

export const fetchRelatedProducts = createAsyncThunk(
  "products/fetchRelatedProducts",

  async (id, thunkAPI) => {
    try {
      return await productApi.getRelatedProducts(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch related products"
      );
    }
  }
);

// ======================================================
// Slice
// ======================================================

const productSlice = createSlice({
  name: "products",

  initialState,

  reducers: {
    // --------------------------------------------------
    // Clear Current Product
    // --------------------------------------------------

    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },

    // --------------------------------------------------
    // Clear Error
    // --------------------------------------------------

    clearProductError: (state) => {
      state.error = null;
    },

    // --------------------------------------------------
    // Clear Products
    // --------------------------------------------------

    clearProducts: (state) => {
      state.products = [];

      state.pagination = {
        page: 1,
        limit: 8,
        totalPages: 1,
        totalProducts: 0,
      };
    },
  },

  extraReducers: (builder) => {
    builder

      // ==================================================
      // FETCH PRODUCTS
      // ==================================================

      .addCase(
        fetchProducts.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchProducts.fulfilled,
        (state, action) => {
          state.loading = false;
          state.error = null;

          const payload = action.payload || {};

          // ------------------------------------------------
          // Products
          // ------------------------------------------------

          state.products =
            payload.products || [];

          // ------------------------------------------------
          // Pagination
          // ------------------------------------------------

          if (payload.pagination) {
            state.pagination = {
              page:
                Number(
                  payload.pagination.page
                ) || 1,

              limit:
                Number(
                  payload.pagination.limit
                ) || 8,

              totalPages:
                Number(
                  payload.pagination.totalPages
                ) || 1,

              totalProducts:
                Number(
                  payload.pagination.totalProducts
                ) || 0,
            };
          } else {
            state.pagination = {
              page:
                Number(
                  payload.currentPage
                ) || 1,

              limit:
                Number(
                  payload.limit
                ) || state.pagination.limit || 8,

              totalPages:
                Number(
                  payload.totalPages
                ) || 1,

              totalProducts:
                Number(
                  payload.totalProducts
                ) || 0,
            };
          }
        }
      )

      .addCase(
        fetchProducts.rejected,
        (state, action) => {
          state.loading = false;

          state.products = [];

          state.error =
            action.payload ||
            "Failed to fetch products";
        }
      )

      // ==================================================
      // FETCH FEATURED PRODUCTS
      // ==================================================

      .addCase(
        fetchFeaturedProducts.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchFeaturedProducts.fulfilled,
        (state, action) => {
          state.loading = false;
          state.error = null;

          state.featuredProducts =
            action.payload?.products || [];
        }
      )

      .addCase(
        fetchFeaturedProducts.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to fetch featured products";
        }
      )

      // ==================================================
      // FETCH PRODUCT BY SLUG
      // ==================================================

      .addCase(
        fetchProductBySlug.pending,
        (state) => {
          state.loading = true;
          state.error = null;
          state.currentProduct = null;
        }
      )

      .addCase(
        fetchProductBySlug.fulfilled,
        (state, action) => {
          state.loading = false;
          state.error = null;

          state.currentProduct =
            action.payload?.product || null;
        }
      )

      .addCase(
        fetchProductBySlug.rejected,
        (state, action) => {
          state.loading = false;

          state.currentProduct = null;

          state.error =
            action.payload ||
            "Product not found";
        }
      )

      // ==================================================
      // FETCH RELATED PRODUCTS
      // ==================================================

      .addCase(
        fetchRelatedProducts.pending,
        (state) => {
          state.loading = true;
        }
      )

      .addCase(
        fetchRelatedProducts.fulfilled,
        (state, action) => {
          state.loading = false;

          state.relatedProducts =
            action.payload?.products || [];
        }
      )

      .addCase(
        fetchRelatedProducts.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to fetch related products";
        }
      );
  },
});

// ======================================================
// Actions
// ======================================================

export const {
  clearCurrentProduct,
  clearProductError,
  clearProducts,
} = productSlice.actions;

// ======================================================
// Reducer
// ======================================================

export default productSlice.reducer;