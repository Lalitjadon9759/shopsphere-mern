import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as authApi from "./authApi";
import {
  getToken,
  getUser,
  removeToken,
  removeUser,
  setToken,
  setUser as saveUser,
} from "../../utils/storage";

const initialState = {
  user: getUser(),
  token: getToken(),
  isAuthenticated: !!getToken(),

  loading: false,
  error: null,
};


// REGISTER

export const register = createAsyncThunk(
  "auth/register",
  async (data, thunkAPI) => {
    try {
      return await authApi.registerUser(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Registration Failed"
      );
    }
  }
);


// LOGIN

export const login = createAsyncThunk(
  "auth/login",
  async (data, thunkAPI) => {
    try {
      return await authApi.loginUser(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login Failed"
      );
    }
  }
);


// PROFILE

export const fetchProfile = createAsyncThunk(
  "auth/profile",
  async (_, thunkAPI) => {
    try {
      return await authApi.getProfile();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
  logout(state) {
    state.user = null;
    state.token = null;
    state.isAuthenticated = false;

    removeToken();
    removeUser();
  },

  clearError(state) {
    state.error = null;
  },

  setLoading(state, action) {
    state.loading = action.payload;
  },

  setUser(state, action) {
    state.user = action.payload;
    state.isAuthenticated = true;
  },

  resetAuth(state) {
    state.user = null;
    state.token = null;
    state.isAuthenticated = false;

    removeToken();
    removeUser();
  },
},

  extraReducers: (builder) => {
    builder

      // LOGIN

      .addCase(login.pending, (state) => {
        state.loading = true;
      })

      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;

        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;

        setUser(action.payload.user);
        setToken(action.payload.token);
      })
      

      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // REGISTER

      .addCase(register.pending, (state) => {
        state.loading = true;
      })

      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;

        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;

        setUser(action.payload.user);
        setToken(action.payload.token);
      })

      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // PROFILE

      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;
      });
  },
  setLoading(state, action) {
    state.loading = action.payload;
},

setUser(state, action) {
    state.user = action.payload;
    state.isAuthenticated = true;
},

resetAuth(state) {
    state.user = null;
    state.token = null;
    state.isAuthenticated = false;

    removeToken();
    removeUser();
}
});

export const {
  logout,
  clearError,
  setLoading,
  setUser,
  resetAuth,
} = authSlice.actions;

export default authSlice.reducer;