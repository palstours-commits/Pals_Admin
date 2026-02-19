import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";

export const getDashboardCounts = createAsyncThunk(
  "dashboard/getDashboardCounts",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: "/admin/dashboard/counts",
        method: "GET",
        token,
      });

      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to fetch dashboard counts",
      );
    }
  },
);

export const getDashboardBookings = createAsyncThunk(
  "dashboard/getDashboardBookings",
  async (date = null, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const endpoint = date
        ? `/admin/dashboard/bookings?date=${date}`
        : "/admin/dashboard/bookings";

      const response = await FetchApi({
        endpoint,
        method: "GET",
        token,
      });

      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to fetch dashboard bookings",
      );
    }
  },
);

export const getDashboardRecent = createAsyncThunk(
  "dashboard/getDashboardRecent",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: "/admin/dashboard/recent",
        method: "GET",
        token,
      });

      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to fetch recent activity",
      );
    }
  },
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    counts: null,
    bookings: [],
    recent: [],
    loading: false,
    bookingsLoading: false,
    recentLoading: false,
    error: null,
  },
  reducers: {
    clearDashboardError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardCounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardCounts.fulfilled, (state, action) => {
        state.loading = false;
        state.counts = action.payload;
      })
      .addCase(getDashboardCounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getDashboardBookings.pending, (state) => {
        state.bookingsLoading = true;
        state.error = null;
      })
      .addCase(getDashboardBookings.fulfilled, (state, action) => {
        state.bookingsLoading = false;
        state.bookings =
          action.payload?.bookings ||
          action.payload?.data ||
          action.payload ||
          [];
      })
      .addCase(getDashboardBookings.rejected, (state, action) => {
        state.bookingsLoading = false;
        state.error = action.payload;
      })

      .addCase(getDashboardRecent.pending, (state) => {
        state.recentLoading = true;
        state.error = null;
      })
      .addCase(getDashboardRecent.fulfilled, (state, action) => {
        state.recentLoading = false;
        state.recent =
          action.payload?.recent ||
          action.payload?.data ||
          action.payload ||
          [];
      })
      .addCase(getDashboardRecent.rejected, (state, action) => {
        state.recentLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDashboardError } = dashboardSlice.actions;

export default dashboardSlice.reducer;
