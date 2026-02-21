import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";

export const createVisa = createAsyncThunk(
  "adminVisa/createVisa",
  async (payload, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: "/admin/visa",
        method: "POST",
        body: payload,
        token,
      });

      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to create visa enquiry",
      );
    }
  },
);

export const getVisas = createAsyncThunk(
  "adminVisa/getVisas",
  async (params = {}, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: "/admin/visa",
        method: "GET",
        params,
        token,
      });

      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to fetch visa enquiries",
      );
    }
  },
);

export const getVisaById = createAsyncThunk(
  "adminVisa/getVisaById",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/visa/${id}`,
        method: "GET",
        token,
      });

      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to fetch visa enquiry",
      );
    }
  },
);

export const updateVisa = createAsyncThunk(
  "adminVisa/updateVisa",
  async ({ id, data }, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/visa/${id}`,
        method: "PUT",
        body: data,
        token,
      });

      thunkAPI.dispatch(getVisas());
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to update visa enquiry",
      );
    }
  },
);

export const deleteVisa = createAsyncThunk(
  "adminVisa/deleteVisa",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/visa/${id}`,
        method: "DELETE",
        token,
      });

      thunkAPI.dispatch(getVisas());
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to delete visa enquiry",
      );
    }
  },
);

export const restoreVisa = createAsyncThunk(
  "adminVisa/restoreVisa",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/visa/${id}/restore`,
        method: "PATCH",
        token,
      });

      thunkAPI.dispatch(getVisas());
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to restore visa enquiry",
      );
    }
  },
);

const visaSlice = createSlice({
  name: "adminVisa",
  initialState: {
    visas: [],
    singleVisa: null,
    loading: false,
    actionLoading: false,
    error: null,
    message: null,
    deletedMessage: null,
    deletedError: null,
  },
  reducers: {
    clearVisaError(state) {
      state.error = null;
      state.deletedError = null;
    },
    clearVisaMessage(state) {
      state.message = null;
      state.deletedMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createVisa.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVisa.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload?.message || "Visa enquiry created";
      })
      .addCase(createVisa.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getVisas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVisas.fulfilled, (state, action) => {
        state.loading = false;
        state.visas = action.payload?.visas;
      })
      .addCase(getVisas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getVisaById.fulfilled, (state, action) => {
        state.singleVisa = action.payload?.visa;
      })

      .addCase(updateVisa.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(updateVisa.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.message =
          action.payload?.message || "Visa enquiry updated successfully";
      })
      .addCase(updateVisa.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      .addCase(deleteVisa.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(deleteVisa.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.deletedMessage =
          action.payload?.message || "Visa enquiry deleted successfully";
      })
      .addCase(deleteVisa.rejected, (state, action) => {
        state.actionLoading = false;
        state.deletedError = action.payload;
      })

      .addCase(restoreVisa.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.message =
          action.payload?.message || "Visa enquiry restored successfully";
      });
  },
});

export const { clearVisaError, clearVisaMessage } = visaSlice.actions;

export default visaSlice.reducer;
