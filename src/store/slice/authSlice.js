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
    if (!token) {
      return thunkAPI.rejectWithValue("No refresh token found");
    }
    try {
      const response = await FetchApi({
        endpoint: "/admins/refresh",
        method: "POST",
        token,
      });

      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Token refresh failed");
    }
  },
);

export const fetchMe = createAsyncThunk("auth/fetchMe", async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const token = state?.auth?.accessToken;
  try {
    const response = await FetchApi({
      endpoint: "/admins/me",
      method: "GET",
      token,
    });
    return response?.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.message || "Token refresh failed");
  }
});

export const checkAndRefreshToken = () => (dispatch) => {
  const expiry = localStorage.getItem("tokenExpiry");
  if (expiry && Date.now() > expiry) {
    dispatch(refreshToken());
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    accessToken: null,
    profileLoading: false,
    refreshToken: null,
    loading: false,
    error: null,
    message: null,
  },

  reducers: {
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.error = null;
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("tokenExpiry");
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
        localStorage.setItem("tokenExpiry", Date.now() + 50 * 60 * 1000);
        localStorage.setItem("loginTimestamp", Date.now());
        state.user = {
          _id: action.payload._id,
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          email: action.payload.email,
          type: action.payload.type,
          status: action.payload.status,
        };

        state.message = "Login Success";
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Invalid email or password";
      })

      .addCase(fetchMe.pending, (state) => {
        state.profileLoading = true;
        state.error = null;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.user = {
          _id: action.payload._id,
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          email: action.payload.email,
          type: action.payload.type,
          status: action.payload.status,
        };
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.profileLoading = false;
        state.error = action.payload;
      })

      .addCase(refreshToken.fulfilled, (state, action) => {
        if (action.payload?.accessToken) {
          state.accessToken = action.payload.accessToken;
          localStorage.setItem("tokenExpiry", Date.now() + 50 * 60 * 1000);
          localStorage.setItem("loginTimestamp", Date.now());
        }
        if (action.payload?.refreshToken) {
          state.refreshToken = action.payload.refreshToken;
        }
      });
  },
});

export const { logout, clearError, clearMessage } = authSlice.actions;
export default authSlice.reducer;
