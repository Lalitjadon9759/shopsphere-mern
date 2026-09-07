import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import * as api from "./reviewApi";

// ======================================================
// Fetch Product Reviews
// ======================================================

export const fetchReviews = createAsyncThunk(
  "review/fetchReviews",
  async (productId, thunkAPI) => {
    try {
      return await api.getReviews(productId);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch reviews"
      );
    }
  }
);

// ======================================================
// Add Review
// ======================================================

export const addReview = createAsyncThunk(
  "review/addReview",
  async (values, thunkAPI) => {
    try {
      const data = await api.createReview(values);

      // Refresh reviews after adding
      thunkAPI.dispatch(
        fetchReviews(values.product)
      );

      return data.review;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to add review"
      );
    }
  }
);

// ======================================================
// Edit Review
// ======================================================

export const editReview = createAsyncThunk(
  "review/editReview",
  async ({ id, values }, thunkAPI) => {
    try {
      const data = await api.updateReview(id, values);

      // Refresh reviews after updating
      thunkAPI.dispatch(
        fetchReviews(values.product)
      );

      return data.review;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to update review"
      );
    }
  }
);

// ======================================================
// Delete Review
// ======================================================

export const removeReview = createAsyncThunk(
  "review/removeReview",
  async ({ id, product }, thunkAPI) => {
    try {
      await api.deleteReview(id);

      // Refresh reviews after deleting
      thunkAPI.dispatch(
        fetchReviews(product)
      );

      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to delete review"
      );
    }
  }
);

// ======================================================
// Initial State
// ======================================================

const initialState = {
  reviews: [],
  loading: false,
  error: null,
};

// ======================================================
// Slice
// ======================================================

const reviewSlice = createSlice({
  name: "review",

  initialState,

  reducers: {
    clearReviewError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // ==================================================
    // Fetch Reviews
    // ==================================================

    builder
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.reviews = action.payload.reviews || [];
      })

      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to fetch reviews";
      });

    // ==================================================
    // Add Review
    // ==================================================

    builder
      .addCase(addReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(addReview.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })

      .addCase(addReview.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to add review";
      });

    // ==================================================
    // Edit Review
    // ==================================================

    builder
      .addCase(editReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(editReview.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })

      .addCase(editReview.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to update review";
      });

    // ==================================================
    // Delete Review
    // ==================================================

    builder
      .addCase(removeReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(removeReview.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })

      .addCase(removeReview.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to delete review";
      });
  },
});

export const { clearReviewError } = reviewSlice.actions;

export default reviewSlice.reducer;