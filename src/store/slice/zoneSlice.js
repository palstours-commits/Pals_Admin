import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";

export const getZones = createAsyncThunk(
  "zone/getZones",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: "/admin/zone",
        method: "GET",
        token,
      });

      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to fetch zones");
    }
  },
);

export const createZone = createAsyncThunk(
  "zone/createZone",
  async (payload, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: "/admin/zone",
        method: "POST",
        body: payload,
        token,
      });

      thunkAPI.dispatch(getZones());
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to create zone");
    }
  },
);

export const updateZone = createAsyncThunk(
  "zone/updateZone",
  async ({ id, data }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/zone/${id}`,
        method: "PUT",
        body: data,
        token,
      });

      thunkAPI.dispatch(getZones());
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to update zone");
    }
  },
);

export const deleteZone = createAsyncThunk(
  "zone/deleteZone",
  async (id, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/zone/${id}`,
        method: "DELETE",
        token,
      });

      thunkAPI.dispatch(getZones());
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to delete zone");
    }
  },
);

export const restoreZone = createAsyncThunk(
  "zone/restoreZone",
  async (id, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/zone/${id}/restore`,
        method: "PATCH",
        token,
      });

      thunkAPI.dispatch(getZones());
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to restore zone");
    }
  },
);

const zoneSlice = createSlice({
  name: "zone",
  initialState: {
    zones: [],
    loading: false,
    actionLoading: false,
    error: null,
    message: null,
    deletedMessage: null,
    deletedError: null,
  },
  reducers: {
    clearZoneError(state) {
      state.error = null;
    },
    clearZoneMessage(state) {
      state.message = null;
    },
    clearDeletedZoneMessage(state) {
      state.deletedMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getZones.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getZones.fulfilled, (state, action) => {
        state.loading = false;
        state.zones = action.payload?.zones || [];
      })
      .addCase(getZones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createZone.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createZone.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.message = action.payload?.message || "Zone created successfully";
      })
      .addCase(createZone.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(updateZone.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateZone.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.message = action.payload?.message || "Zone updated successfully";
      })
      .addCase(updateZone.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteZone.pending, (state) => {
        state.actionLoading = true;
        state.deletedError = null;
      })
      .addCase(deleteZone.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.deletedMessage =
          action.payload?.message || "Zone deleted successfully";
      })
      .addCase(deleteZone.rejected, (state, action) => {
        state.actionLoading = false;
        state.deletedError = action.payload;
      })
      .addCase(restoreZone.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(restoreZone.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.message = action.payload?.message || "Zone restored successfully";
      })
      .addCase(restoreZone.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearZoneError, clearZoneMessage, clearDeletedZoneMessage } =
  zoneSlice.actions;

export default zoneSlice.reducer;
