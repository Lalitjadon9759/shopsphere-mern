import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import * as wishlistApi from "./wishlistApi";

// ======================================================
// FETCH WISHLIST
// ======================================================

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, { rejectWithValue }) => {
    try {
      return await wishlistApi.getWishlist();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to load wishlist"
      );
    }
  }
);

// ======================================================
// ADD TO WISHLIST
// ======================================================

export const addWishlistItem = createAsyncThunk(
  "wishlist/addWishlistItem",
  async (productId, { rejectWithValue }) => {
    try {
      return await wishlistApi.addToWishlist(
        productId
      );
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to add product to wishlist"
      );
    }
  }
);

// ======================================================
// REMOVE FROM WISHLIST
// ======================================================

export const removeWishlistItem =
  createAsyncThunk(
    "wishlist/removeWishlistItem",
    async (productId, { rejectWithValue }) => {
      try {
        return await wishlistApi.removeFromWishlist(
          productId
        );
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            "Failed to remove product"
        );
      }
    }
  );

// ======================================================
// CLEAR WISHLIST
// ======================================================

export const clearUserWishlist = createAsyncThunk(
  "wishlist/clearUserWishlist",
  async (_, { rejectWithValue }) => {
    try {
      return await wishlistApi.clearWishlist();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to clear wishlist"
      );
    }
  }
);

// ======================================================
// INITIAL STATE
// ======================================================

const initialState = {
  wishlist: null,
  products: [],
  loading: false,
  error: null,
};

// ======================================================
// SLICE
// ======================================================

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,

  reducers: {
    clearWishlistState: (state) => {
      state.wishlist = null;
      state.products = [];
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(
        fetchWishlist.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchWishlist.fulfilled,
        (state, action) => {
          state.loading = false;

          state.wishlist =
            action.payload?.wishlist || null;

          state.products =
            action.payload?.wishlist?.products ||
            [];
        }
      )

      .addCase(
        fetchWishlist.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // ADD
      .addCase(
        addWishlistItem.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        addWishlistItem.fulfilled,
        (state, action) => {
          state.loading = false;

          state.wishlist =
            action.payload?.wishlist || null;

          state.products =
            action.payload?.wishlist?.products ||
            [];
        }
      )

      .addCase(
        addWishlistItem.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // REMOVE
      .addCase(
        removeWishlistItem.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        removeWishlistItem.fulfilled,
        (state, action) => {
          state.loading = false;

          state.wishlist =
            action.payload?.wishlist || null;

          state.products =
            action.payload?.wishlist?.products ||
            [];
        }
      )

      .addCase(
        removeWishlistItem.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // CLEAR
      .addCase(
        clearUserWishlist.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        clearUserWishlist.fulfilled,
        (state) => {
          state.loading = false;

          if (state.wishlist) {
            state.wishlist.products = [];
          }

          state.products = [];
        }
      )

      .addCase(
        clearUserWishlist.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const {
  clearWishlistState,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;