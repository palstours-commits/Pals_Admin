import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";

export const getPackages = createAsyncThunk(
  "package/getPackages",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: "/admin/package",
        method: "GET",
        token,
      });

      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to fetch packages",
      );
    }
  },
);

export const getPackageById = createAsyncThunk(
  "package/getPackageById",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/package/${id}`,
        method: "GET",
        token,
      });

      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to fetch package");
    }
  },
);

export const getPackagesByZone = createAsyncThunk(
  "package/getPackagesByZone",
  async (zoneId, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/package/zone/${zoneId}`,
        method: "GET",
        token,
      });

      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to fetch zone packages",
      );
    }
  },
);

export const createPackage = createAsyncThunk(
  "package/createPackage",
  async (payload, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: "/admin/package",
        method: "POST",
        body: payload,
        token,
      });

      thunkAPI.dispatch(getPackages());
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to create package",
      );
    }
  },
);

export const updatePackage = createAsyncThunk(
  "package/updatePackage",
  async ({ id, data }, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/package/${id}`,
        method: "PUT",
        body: data,
        token,
      });

      thunkAPI.dispatch(getPackages());
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to update package",
      );
    }
  },
);

export const deletePackage = createAsyncThunk(
  "package/deletePackage",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/package/${id}`,
        method: "DELETE",
        token,
      });

      thunkAPI.dispatch(getPackages());
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to delete package",
      );
    }
  },
);

export const deletePackageImage = createAsyncThunk(
  "package/deletePackageImage",
  async ({ packageId, image }, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/package/${packageId}/delete-image`,
        method: "DELETE",
        body: { image },
        token,
      });

      return { image, ...response?.data };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to delete package image",
      );
    }
  },
);

export const restorePackage = createAsyncThunk(
  "package/restorePackage",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/package/${id}/restore`,
        method: "PATCH",
        token,
      });

      thunkAPI.dispatch(getPackages());
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to restore package",
      );
    }
  },
);

const packageSlice = createSlice({
  name: "package",
  initialState: {
    packages: [],
    singlePackage: null,
    loading: false,
    actionLoading: false,
    error: null,
    message: null,
    deletedMessage: null,
    deletedError: null,
  },
  reducers: {
    clearPackageError(state) {
      state.error = null;
    },
    clearPackageMessage(state) {
      state.message = null;
    },
    clearDeletedPackageMessage(state) {
      state.deletedMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPackages.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPackages.fulfilled, (state, action) => {
        state.loading = false;
        state.packages = action.payload?.packages || [];
      })
      .addCase(getPackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getPackageById.fulfilled, (state, action) => {
        state.singlePackage = action.payload?.package || null;
      })

      .addCase(createPackage.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(createPackage.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.message =
          action.payload?.message || "Package created successfully";
      })

      .addCase(updatePackage.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.message =
          action.payload?.message || "Package updated successfully";
      })

      .addCase(deletePackage.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.deletedMessage =
          action.payload?.message || "Package deleted successfully";
      })
      .addCase(restorePackage.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.message =
          action.payload?.message || "Package restored successfully";
      });
  },
});

export const {
  clearPackageError,
  clearPackageMessage,
  clearDeletedPackageMessage,
} = packageSlice.actions;

export default packageSlice.reducer;
