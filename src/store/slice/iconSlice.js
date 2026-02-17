import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";


export const getIcons = createAsyncThunk(
  "icon/getIcons",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: "/admin/icon",
        method: "GET",
        token,
      });
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to fetch icons");
    }
  }
);


export const getIconById = createAsyncThunk(
  "icon/getIconById",
  async (id, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/icon/${id}`,
        method: "GET",
        token,
      });
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to fetch icon");
    }
  }
);


export const createIcon = createAsyncThunk(
  "icon/createIcon",
  async (payload, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: "/admin/icon",
        method: "POST",
        body: payload,
        token,
      });

      thunkAPI.dispatch(getIcons());
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to create icon");
    }
  }
);


export const updateIcon = createAsyncThunk(
  "icon/updateIcon",
  async ({ id, data }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/icon/${id}`,
        method: "PUT",
        body: data,
        token,
      });

      thunkAPI.dispatch(getIcons());
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to update icon");
    }
  }
);


export const deleteIcon = createAsyncThunk(
  "icon/deleteIcon",
  async (id, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.accessToken;

    try {
      await FetchApi({
        endpoint: `/admin/icon/${id}`,
        method: "DELETE",
        token,
      });

      thunkAPI.dispatch(getIcons());
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to delete icon");
    }
  }
);


export const restoreIcon = createAsyncThunk(
  "icon/restoreIcon",
  async (id, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.accessToken;

    try {
      await FetchApi({
        endpoint: `/admin/icon/${id}/restore`,
        method: "PATCH",
        token,
      });

      thunkAPI.dispatch(getIcons());
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to restore icon");
    }
  }
);

const iconSlice = createSlice({
  name: "icon",
  initialState: {
    icons: [],
    singleIcon: null,
    loading: false,
    actionLoading: false,
    error: null,
    message: null,
    deletedMessage: null,
    deletedError: null,
  },
  reducers: {
    clearIconError(state) {
      state.error = null;
      state.deletedError = null;
    },
    clearIconMessage(state) {
      state.message = null;
      state.deletedMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIcons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIcons.fulfilled, (state, action) => {
        state.loading = false;
        state.icons = action.payload?.icons;
      })
      .addCase(getIcons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getIconById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getIconById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleIcon = action.payload?.icon;
      })
      .addCase(getIconById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createIcon.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createIcon.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.message = action.payload?.message || "Icon created successfully";
      })
      .addCase(createIcon.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      .addCase(updateIcon.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateIcon.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.message = action.payload?.message || "Icon updated successfully";
      })
      .addCase(updateIcon.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      .addCase(deleteIcon.pending, (state) => {
        state.actionLoading = true;
        state.deletedError = null;
      })
      .addCase(deleteIcon.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.deletedMessage =
          action.payload?.message || "Icon deleted successfully";
      })
      .addCase(deleteIcon.rejected, (state, action) => {
        state.actionLoading = false;
        state.deletedError = action.payload;
      })

      .addCase(restoreIcon.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(restoreIcon.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.message =
          action.payload?.message || "Icon restored successfully";
      })
      .addCase(restoreIcon.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearIconError, clearIconMessage } = iconSlice.actions;
export default iconSlice.reducer;
