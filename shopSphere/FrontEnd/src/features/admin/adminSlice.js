import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import * as adminApi from "./adminApi";

// ======================================================
// Dashboard
// ======================================================

export const fetchDashboard = createAsyncThunk(
  "admin/dashboard",
  async (_, thunkAPI) => {
    try {
      return await adminApi.getDashboard();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message
      );
    }
  }
);

// ======================================================
// Reviews
// ======================================================

export const fetchAdminReviews = createAsyncThunk(
  "admin/fetchReviews",
  async (_, thunkAPI) => {
    try {
      return await adminApi.getAllReviews();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message
      );
    }
  }
);

// ======================================================
// Toggle Review Status
// ======================================================

export const toggleAdminReviewStatus =
  createAsyncThunk(
    "admin/toggleReviewStatus",
    async (id, thunkAPI) => {
      try {
        return await adminApi.toggleReviewStatus(id);
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
            error.message
        );
      }
    }
  );

// ======================================================
// Initial State
// ======================================================

const initialState = {
  dashboard: null,

  reviews: [],

  loading: false,

  reviewsLoading: false,

  reviewActionLoading: false,

  error: null,

  reviewsError: null,
};

// ======================================================
// Slice
// ======================================================

const adminSlice = createSlice({
  name: "admin",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      // ==================================================
      // Dashboard
      // ==================================================

      .addCase(
        fetchDashboard.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchDashboard.fulfilled,
        (state, action) => {
          state.loading = false;
          state.dashboard =
            action.payload.dashboard;
        }
      )

      .addCase(
        fetchDashboard.rejected,
        (state, action) => {
          state.loading = false;
          state.error =
            action.payload ||
            action.error.message;
        }
      )

      // ==================================================
      // Fetch Reviews
      // ==================================================

      .addCase(
        fetchAdminReviews.pending,
        (state) => {
          state.reviewsLoading = true;
          state.reviewsError = null;
        }
      )

      .addCase(
        fetchAdminReviews.fulfilled,
        (state, action) => {
          state.reviewsLoading = false;

          state.reviews =
            action.payload.reviews || [];
        }
      )

      .addCase(
        fetchAdminReviews.rejected,
        (state, action) => {
          state.reviewsLoading = false;

          state.reviewsError =
            action.payload ||
            action.error.message;
        }
      )

      // ==================================================
      // Toggle Review Status
      // ==================================================

      .addCase(
        toggleAdminReviewStatus.pending,
        (state) => {
          state.reviewActionLoading = true;
        }
      )

      .addCase(
        toggleAdminReviewStatus.fulfilled,
        (state, action) => {
          state.reviewActionLoading = false;

          const updatedReview =
            action.payload.review;

          const index = state.reviews.findIndex(
            (review) =>
              review._id ===
              updatedReview._id
          );

          if (index !== -1) {
            state.reviews[index] =
              updatedReview;
          }
        }
      )

      .addCase(
        toggleAdminReviewStatus.rejected,
        (state, action) => {
          state.reviewActionLoading = false;

          state.reviewsError =
            action.payload ||
            action.error.message;
        }
      );
  },
});

export default adminSlice.reducer;