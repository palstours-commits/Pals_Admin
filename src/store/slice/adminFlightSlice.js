import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";

export const createFlight = createAsyncThunk(
  "adminFlight/createFlight",
  async (payload, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;
    try {
      const response = await FetchApi({
        endpoint: "/admin/flight",
        method: "POST",
        body: payload,
        token,
      });

      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to fetch flight bookings",
      );
    }
  },
);

export const getFlights = createAsyncThunk(
  "adminFlight/getFlights",
  async (params = {}, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;
    try {
      const response = await FetchApi({
        endpoint: "/admin/flight",
        method: "GET",
        params,
        token,
      });

      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to fetch flight bookings",
      );
    }
  },
);

export const getFlightById = createAsyncThunk(
  "adminFlight/getFlightById",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/flight/${id}`,
        method: "GET",
        token,
      });

      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to fetch flight booking",
      );
    }
  },
);

export const updateFlight = createAsyncThunk(
  "adminFlight/updateFlight",
  async ({ id, data }, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/flight/${id}`,
        method: "PUT",
        body: data,
        token,
      });

      thunkAPI.dispatch(getFlights());
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to update flight booking",
      );
    }
  },
);

export const deleteFlight = createAsyncThunk(
  "adminFlight/deleteFlight",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/flight/${id}`,
        method: "DELETE",
        token,
      });

      thunkAPI.dispatch(getFlights());
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to delete flight booking",
      );
    }
  },
);

export const restoreFlight = createAsyncThunk(
  "adminFlight/restoreFlight",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/flight/${id}/restore`,
        method: "PATCH",
        token,
      });

      thunkAPI.dispatch(getFlights());
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to restore flight booking",
      );
    }
  },
);

const adminFlightSlice = createSlice({
  name: "adminFlight",
  initialState: {
    flights: [],
    singleFlight: null,
    loading: false,
    actionLoading: false,
    error: null,
    message: null,
    deletedMessage: null,
    deletedError: null,
  },
  reducers: {
    clearFlightError(state) {
      state.error = null;
      state.deletedError = null;
    },
    clearFlightMessage(state) {
      state.message = null;
      state.deletedMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createFlight.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFlight.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "Booking Success";
      })
      .addCase(createFlight.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getFlights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFlights.fulfilled, (state, action) => {
        state.loading = false;
        state.flights = action.payload?.flights;
      })
      .addCase(getFlights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getFlightById.fulfilled, (state, action) => {
        state.singleFlight = action.payload?.flight;
      })

      .addCase(updateFlight.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(updateFlight.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.message =
          action.payload?.message || "Flight updated successfully";
      })
      .addCase(updateFlight.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      .addCase(deleteFlight.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(deleteFlight.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.deletedMessage =
          action.payload?.message || "Flight deleted successfully";
      })
      .addCase(deleteFlight.rejected, (state, action) => {
        state.actionLoading = false;
        state.deletedError = action.payload;
      })

      .addCase(restoreFlight.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.message =
          action.payload?.message || "Flight restored successfully";
      });
  },
});

export const { clearFlightError, clearFlightMessage } =
  adminFlightSlice.actions;

export default adminFlightSlice.reducer;
