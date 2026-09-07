import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "./categoryApi";

export const fetchCategories = createAsyncThunk(
  "category/fetch",
  async (_, thunkAPI) => {
    try {
      return await api.getCategories();
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message
      );
    }
  }
);

export const addCategory = createAsyncThunk(
  "category/add",
  async (values, thunkAPI) => {
    try {
      const data = await api.createCategory(values);
      thunkAPI.dispatch(fetchCategories());
      return data.category;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message
      );
    }
  }
);

export const editCategory = createAsyncThunk(
  "category/edit",
  async ({ id, values }, thunkAPI) => {
    try {
      const data = await api.updateCategory(id, values);
      thunkAPI.dispatch(fetchCategories());
      return data.category;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message
      );
    }
  }
);

export const removeCategory = createAsyncThunk(
  "category/delete",
  async (id, thunkAPI) => {
    try {
      await api.deleteCategory(id);
      thunkAPI.dispatch(fetchCategories());
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message
      );
    }
  }
);

const categorySlice = createSlice({
  name: "category",

  initialState: {
    categories: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.categories;
      })

      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default categorySlice.reducer;