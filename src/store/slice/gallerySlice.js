import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";

export const getGallery = createAsyncThunk(
  "gallery/getGallery",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: "/admin/gallery",
        method: "GET",
        token,
      });

      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch gallery",
      );
    }
  },
);

export const getGalleryById = createAsyncThunk(
  "gallery/getGalleryById",
  async (id, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/gallery/${id}`,
        method: "GET",
        token,
      });

      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch gallery item",
      );
    }
  },
);

export const createGallery = createAsyncThunk(
  "gallery/createGallery",
  async (payload, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: "/admin/gallery",
        method: "POST",
        body: payload,
        token,
      });

      thunkAPI.dispatch(getGallery());

      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to upload gallery",
      );
    }
  },
);

export const deleteGallery = createAsyncThunk(
  "gallery/deleteGallery",
  async (id, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/gallery/${id}`,
        method: "DELETE",
        token,
      });

      thunkAPI.dispatch(getGallery());

      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete gallery",
      );
    }
  },
);

export const deleteGalleryFile = createAsyncThunk(
  "gallery/deleteGalleryFile",
  async (id, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/gallery/${id}/delete-file`,
        method: "DELETE",
        token,
      });

      thunkAPI.dispatch(getGallery());

      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to permanently delete gallery file",
      );
    }
  },
);

export const restoreGallery = createAsyncThunk(
  "gallery/restoreGallery",
  async (id, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/gallery/${id}/restore`,
        method: "PATCH",
        token,
      });

      thunkAPI.dispatch(getGallery());

      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to restore gallery",
      );
    }
  },
);

export const getGalleryImages = createAsyncThunk(
  "gallery/getGalleryImages",
  async (_, thunkAPI) => {
    try {
      const response = await FetchApi({
        endpoint: "/user/gallery/images",
        method: "GET",
      });

      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch gallery images",
      );
    }
  },
);

export const getGalleryVideos = createAsyncThunk(
  "gallery/getGalleryVideos",
  async (_, thunkAPI) => {
    try {
      const response = await FetchApi({
        endpoint: "/user/gallery/videos",
        method: "GET",
      });

      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch gallery videos",
      );
    }
  },
);

const gallerySlice = createSlice({
  name: "gallery",

  initialState: {
    galleries: [],
    galleryItem: null,
    galleryImages: [],
    galleryVideos: [],

    loading: false,
    actionLoading: false,

    error: null,
    message: null,

    deletedMessage: null,
    deletedError: null,

    imageLoading: false,
    videoLoading: false,
  },

  reducers: {
    clearGalleryError(state) {
      state.error = null;
    },

    clearGalleryMessage(state) {
      state.message = null;
    },

    clearDeletedGalleryMessage(state) {
      state.deletedMessage = null;
    },

    clearGalleryItem(state) {
      state.galleryItem = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(getGallery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getGallery.fulfilled, (state, action) => {
        state.loading = false;

        state.galleries =
          action.payload?.galleries ||
          action.payload?.gallery ||
          action.payload ||
          [];
      })

      .addCase(getGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getGalleryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getGalleryById.fulfilled, (state, action) => {
        state.loading = false;
        state.galleryItem =
          action.payload?.gallery ||
          action.payload?.galleryItem ||
          action.payload ||
          null;
      })

      .addCase(getGalleryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createGallery.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })

      .addCase(createGallery.fulfilled, (state, action) => {
        state.actionLoading = false;

        state.message =
          action.payload?.message || "Gallery uploaded successfully";
      })

      .addCase(createGallery.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      .addCase(deleteGallery.pending, (state) => {
        state.actionLoading = true;
        state.deletedError = null;
      })

      .addCase(deleteGallery.fulfilled, (state, action) => {
        state.actionLoading = false;

        state.deletedMessage =
          action.payload?.message || "Gallery deleted successfully";
      })

      .addCase(deleteGallery.rejected, (state, action) => {
        state.actionLoading = false;
        state.deletedError = action.payload;
      })

      .addCase(deleteGalleryFile.pending, (state) => {
        state.actionLoading = true;
        state.deletedError = null;
      })

      .addCase(deleteGalleryFile.fulfilled, (state, action) => {
        state.actionLoading = false;

        state.deletedMessage =
          action.payload?.message ||
          "Gallery file permanently deleted successfully";
      })

      .addCase(deleteGalleryFile.rejected, (state, action) => {
        state.actionLoading = false;
        state.deletedError = action.payload;
      })

      .addCase(restoreGallery.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })

      .addCase(restoreGallery.fulfilled, (state, action) => {
        state.actionLoading = false;

        state.message =
          action.payload?.message || "Gallery restored successfully";
      })

      .addCase(restoreGallery.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      .addCase(getGalleryImages.pending, (state) => {
        state.imageLoading = true;
        state.error = null;
      })

      .addCase(getGalleryImages.fulfilled, (state, action) => {
        state.imageLoading = false;

        state.galleryImages =
          action.payload?.images ||
          action.payload?.gallery ||
          action.payload ||
          [];
      })

      .addCase(getGalleryImages.rejected, (state, action) => {
        state.imageLoading = false;
        state.galleryImages = [];
        state.error = action.payload;
      })

      .addCase(getGalleryVideos.pending, (state) => {
        state.videoLoading = true;
        state.error = null;
      })

      .addCase(getGalleryVideos.fulfilled, (state, action) => {
        state.videoLoading = false;

        state.galleryVideos =
          action.payload?.videos ||
          action.payload?.gallery ||
          action.payload ||
          [];
      })

      .addCase(getGalleryVideos.rejected, (state, action) => {
        state.videoLoading = false;
        state.galleryVideos = [];
        state.error = action.payload;
      });
  },
});

export const {
  clearGalleryError,
  clearGalleryMessage,
  clearDeletedGalleryMessage,
  clearGalleryItem,
} = gallerySlice.actions;

export default gallerySlice.reducer;
