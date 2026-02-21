import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";

export const createTransport = createAsyncThunk(
  "adminTransport/createTransport",
  async (payload, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: "/admin/transport",
        method: "POST",
        body: payload,
        token,
      });

      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to create transport booking",
      );
    }
  },
);

export const getTransports = createAsyncThunk(
  "adminTransport/getTransports",
  async (params = {}, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: "/admin/transport",
        method: "GET",
        params,
        token,
      });

      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to fetch transport bookings",
      );
    }
  },
);

export const getTransportById = createAsyncThunk(
  "adminTransport/getTransportById",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/transport/${id}`,
        method: "GET",
        token,
      });

      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to fetch transport booking",
      );
    }
  },
);

export const updateTransport = createAsyncThunk(
  "adminTransport/updateTransport",
  async ({ id, data }, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/transport/${id}`,
        method: "PUT",
        body: data,
        token,
      });

      thunkAPI.dispatch(getTransports());
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to update transport booking",
      );
    }
  },
);

export const deleteTransport = createAsyncThunk(
  "adminTransport/deleteTransport",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/transport/${id}`,
        method: "DELETE",
        token,
      });

      thunkAPI.dispatch(getTransports());
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to delete transport booking",
      );
    }
  },
);

export const restoreTransport = createAsyncThunk(
  "adminTransport/restoreTransport",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/transport/${id}/restore`,
        method: "PATCH",
        token,
      });

      thunkAPI.dispatch(getTransports());
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to restore transport booking",
      );
    }
  },
);

const transportSlice = createSlice({
  name: "adminTransport",
  initialState: {
    transports: [],
    singleTransport: null,
    loading: false,
    actionLoading: false,
    error: null,
    message: null,
    deletedMessage: null,
    deletedError: null,
  },
  reducers: {
    clearTransportError(state) {
      state.error = null;
      state.deletedError = null;
    },
    clearTransportMessage(state) {
      state.message = null;
      state.deletedMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTransport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTransport.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "Transport booking created";
      })
      .addCase(createTransport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getTransports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTransports.fulfilled, (state, action) => {
        state.loading = false;
        state.transports = action.payload?.transports;
      })
      .addCase(getTransports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getTransportById.fulfilled, (state, action) => {
        state.singleTransport = action.payload?.transport;
      })

      .addCase(updateTransport.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(updateTransport.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.message =
          action.payload?.message || "Transport booking updated successfully";
      })
      .addCase(updateTransport.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      .addCase(deleteTransport.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(deleteTransport.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.deletedMessage =
          action.payload?.message || "Transport booking deleted successfully";
      })
      .addCase(deleteTransport.rejected, (state, action) => {
        state.actionLoading = false;
        state.deletedError = action.payload;
      })

      .addCase(restoreTransport.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.message =
          action.payload?.message || "Transport booking restored successfully";
      });
  },
});

export const { clearTransportError, clearTransportMessage } =
  transportSlice.actions;

export default transportSlice.reducer;
