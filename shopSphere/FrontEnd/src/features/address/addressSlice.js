import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as addressApi from "./addressApi";

// ======================================================
// Fetch Addresses
// ======================================================

export const fetchAddresses = createAsyncThunk(
  "address/fetchAddresses",
  async (_, thunkAPI) => {
    try {
      return await addressApi.getAddresses();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch addresses"
      );
    }
  }
);

// ======================================================
// Add Address
// ======================================================

export const addAddress = createAsyncThunk(
  "address/addAddress",
  async (data, thunkAPI) => {
    try {
      return await addressApi.createAddress(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to add address"
      );
    }
  }
);

// ======================================================
// Update Address
// ======================================================

export const editAddress = createAsyncThunk(
  "address/editAddress",
  async ({ id, data }, thunkAPI) => {
    try {
      return await addressApi.updateAddress({ id, data });
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update address"
      );
    }
  }
);

// ======================================================
// Delete Address
// ======================================================

export const removeAddress = createAsyncThunk(
  "address/removeAddress",
  async (id, thunkAPI) => {
    try {
      await addressApi.deleteAddress(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete address"
      );
    }
  }
);

// ======================================================
// Make Default Address
// ======================================================

export const makeDefaultAddress = createAsyncThunk(
  "address/default",
  async (id, thunkAPI) => {
    try {
      await addressApi.setDefaultAddress(id);
      return await addressApi.getAddresses();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to update default address"
      );
    }
  }
);

const initialState = {
  addresses: [],
  selectedAddress: null,
  loading: false,
  error: null,
};

const addressSlice = createSlice({
  name: "address",

  initialState,

  reducers: {
    selectAddress: (state, action) => {
      state.selectedAddress = action.payload;
    },

    clearSelectedAddress: (state) => {
      state.selectedAddress = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // Fetch
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;

        state.addresses = action.payload.addresses;

        if (!state.selectedAddress) {
          const defaultAddress = action.payload.addresses.find(
            (item) => item.isDefault
          );

          if (defaultAddress) {
            state.selectedAddress = defaultAddress;
          }
        }
      })

      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add
      .addCase(addAddress.fulfilled, (state, action) => {
        state.addresses.unshift(action.payload.address);

        if (action.payload.address.isDefault) {
          state.selectedAddress = action.payload.address;
        }
      })

      // Update
      .addCase(editAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.map((address) =>
          address._id === action.payload.address._id
            ? action.payload.address
            : address
        );

        if (
          state.selectedAddress?._id ===
          action.payload.address._id
        ) {
          state.selectedAddress = action.payload.address;
        }
      })

      // Delete
      .addCase(removeAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.filter(
          (address) => address._id !== action.payload
        );

        if (state.selectedAddress?._id === action.payload) {
          state.selectedAddress = null;
        }
      })

      // Default
      .addCase(makeDefaultAddress.fulfilled, (state, action) => {
        state.addresses = action.payload.addresses;

        const defaultAddress =
          action.payload.addresses.find(
            (item) => item.isDefault
          );

        if (defaultAddress) {
          state.selectedAddress = defaultAddress;
        }
      });
  },
});

export const {
  selectAddress,
  clearSelectedAddress,
} = addressSlice.actions;

export default addressSlice.reducer;