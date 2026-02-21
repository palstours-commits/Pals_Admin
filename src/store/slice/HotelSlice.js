import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";

export const createHotel = createAsyncThunk(
  "adminHotel/createHotel",
  async (payload, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: "/admin/hotel",
        method: "POST",
        body: payload,
        token,
      });

      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to create hotel booking",
      );
    }
  },
);

export const getHotels = createAsyncThunk(
  "adminHotel/getHotels",
  async (params = {}, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: "/admin/hotel",
        method: "GET",
        params,
        token,
      });

      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to fetch hotel bookings",
      );
    }
  },
);

export const getHotelById = createAsyncThunk(
  "adminHotel/getHotelById",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/hotel/${id}`,
        method: "GET",
        token,
      });

      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to fetch hotel booking",
      );
    }
  },
);

export const updateHotel = createAsyncThunk(
  "adminHotel/updateHotel",
  async ({ id, data }, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/hotel/${id}`,
        method: "PUT",
        body: data,
        token,
      });

      thunkAPI.dispatch(getHotels());
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to update hotel booking",
      );
    }
  },
);

export const deleteHotel = createAsyncThunk(
  "adminHotel/deleteHotel",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/hotel/${id}`,
        method: "DELETE",
        token,
      });

      thunkAPI.dispatch(getHotels());
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to delete hotel booking",
      );
    }
  },
);

export const restoreHotel = createAsyncThunk(
  "adminHotel/restoreHotel",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/hotel/${id}/restore`,
        method: "PATCH",
        token,
      });

      thunkAPI.dispatch(getHotels());
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to restore hotel booking",
      );
    }
  },
);

const hotelSlice = createSlice({
  name: "adminHotel",
  initialState: {
    hotels: [],
    singleHotel: null,
    loading: false,
    actionLoading: false,
    error: null,
    message: null,
    deletedMessage: null,
    deletedError: null,
  },
  reducers: {
    clearHotelError(state) {
      state.error = null;
      state.deletedError = null;
    },
    clearHotelMessage(state) {
      state.message = null;
      state.deletedMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createHotel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHotel.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "Hotel booking created";
      })
      .addCase(createHotel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getHotels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getHotels.fulfilled, (state, action) => {
        state.loading = false;
        state.hotels = action.payload?.hotels;
      })
      .addCase(getHotels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getHotelById.fulfilled, (state, action) => {
        state.singleHotel = action.payload?.hotel;
      })

      .addCase(updateHotel.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(updateHotel.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.message =
          action.payload?.message || "Hotel booking updated successfully";
      })
      .addCase(updateHotel.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      .addCase(deleteHotel.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(deleteHotel.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.deletedMessage =
          action.payload?.message || "Hotel booking deleted successfully";
      })
      .addCase(deleteHotel.rejected, (state, action) => {
        state.actionLoading = false;
        state.deletedError = action.payload;
      })

      .addCase(restoreHotel.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.message =
          action.payload?.message || "Hotel booking restored successfully";
      });
  },
});

export const { clearHotelError, clearHotelMessage } = hotelSlice.actions;

export default hotelSlice.reducer;
