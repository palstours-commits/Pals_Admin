import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (payload, thunkAPI) => {
    try {

      const response = await FetchApi({
        endpoint: `/admins/login`,
        method: "POST",
        body: payload,
      });

      
      if (response?.data?.success === false) {
        return thunkAPI.rejectWithValue(response?.data?.errors);
      }
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Login failed. Please try again.",
      );
    }
  },
);

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.refreshToken;
    try {
      const response = await FetchApi({
        endpoint: "/admins/refresh",
        method: "POST",
        token,
      });
      const data = response?.data;
      if (data?.accessToken) {
        localStorage.setItem("tokenExpiry", Date.now() + 50 * 60 * 1000);
      }
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Token refresh failed");
    }
  },
);
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    accessToken: null,
    refreshToken: null,
    loading: false,
    error: null,
    message: null,
  },

  reducers: {
    logout(state) {
      state.user = null;
      state.accessToken = null;
    },
    clearError(state) {
      state.error = null;
    },
    clearMessage(state) {
      state.message = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.user = {
          _id: action.payload._id,
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          email: action.payload.email,
          type: action.payload.type,
          status: action.payload.status,
        };
        localStorage.setItem("loginTimestamp", Date.now());
        localStorage.setItem("tokenExpiry", Date.now() + 50 * 60 * 1000);
        state.message = "Login Success";
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Invalid email or password";
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.accessToken = action.payload?.accessToken;
        state.refreshToken = action.payload?.refreshToken || state.refreshToken;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.refreshError = action.payload || "Failed to refresh token";
      });
  },
});

export const { logout, clearError, clearMessage } = authSlice.actions;
export default authSlice.reducer;
