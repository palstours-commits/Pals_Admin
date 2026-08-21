import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";

export const getGallery = createAsyncThunk(
  "gallery/getGallery",
  async (
    { imagePage = 1, imageLimit = 10, videoPage = 1, videoLimit = 10 } = {},
    thunkAPI,
  ) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.accessToken;

    try {
      const params = new URLSearchParams();

      params.append("imagePage", imagePage);
      params.append("imageLimit", imageLimit);
      params.append("videoPage", videoPage);
      params.append("videoLimit", videoLimit);

      const response = await FetchApi({
        endpoint: `/admin/gallery?${params.toString()}`,
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

      const currentState = thunkAPI.getState().gallery;
      thunkAPI.dispatch(
        getGallery({
          imagePage: currentState.imagePage || 1,
          imageLimit: currentState.imageLimit || 10,
          videoPage: currentState.videoPage || 1,
          videoLimit: currentState.videoLimit || 10,
        }),
      );

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

      const currentState = thunkAPI.getState().gallery;
      const imageTotalPages = currentState.imageTotalPages || 1;
      const videoTotalPages = currentState.videoTotalPages || 1;

      let imagePage = currentState.imagePage || 1;
      let videoPage = currentState.videoPage || 1;

      if (imagePage > imageTotalPages) {
        imagePage = Math.max(1, imageTotalPages);
      }

      if (videoPage > videoTotalPages) {
        videoPage = Math.max(1, videoTotalPages);
      }

      thunkAPI.dispatch(
        getGallery({
          imagePage: imagePage,
          imageLimit: currentState.imageLimit || 10,
          videoPage: videoPage,
          videoLimit: currentState.videoLimit || 10,
        }),
      );

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

      const currentState = thunkAPI.getState().gallery;
      thunkAPI.dispatch(
        getGallery({
          imagePage: currentState.imagePage || 1,
          imageLimit: currentState.imageLimit || 10,
          videoPage: currentState.videoPage || 1,
          videoLimit: currentState.videoLimit || 10,
        }),
      );

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

      const currentState = thunkAPI.getState().gallery;
      thunkAPI.dispatch(
        getGallery({
          imagePage: currentState.imagePage || 1,
          imageLimit: currentState.imageLimit || 10,
          videoPage: currentState.videoPage || 1,
          videoLimit: currentState.videoLimit || 10,
        }),
      );

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
    imagePage: 1,
    imageLimit: 10,
    imageTotal: 0,
    imageTotalPages: 1,
    videoPage: 1,
    videoLimit: 10,
    videoTotal: 0,
    videoTotalPages: 1,
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
    setImagePage(state, action) {
      state.imagePage = action.payload;
    },
    setImageLimit(state, action) {
      state.imageLimit = action.payload;
    },
    setVideoPage(state, action) {
      state.videoPage = action.payload;
    },
    setVideoLimit(state, action) {
      state.videoLimit = action.payload;
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

        const data = action.payload || {};

        const images =
          data?.images?.data ||
          data?.images?.items ||
          data?.images?.galleries ||
          data?.images ||
          data?.galleryImages ||
          [];

        const videos =
          data?.videos?.data ||
          data?.videos?.items ||
          data?.videos?.galleries ||
          data?.videos ||
          data?.galleryVideos ||
          [];

        const combined = data?.galleries || data?.gallery || [];

        state.galleryImages = Array.isArray(images) ? images : [];
        state.galleryVideos = Array.isArray(videos) ? videos : [];
        state.galleries = Array.isArray(combined)
          ? combined
          : [...state.galleryImages, ...state.galleryVideos];

        state.imagePage = Number(
          data?.imagePage ??
            data?.images?.page ??
            data?.images?.currentPage ??
            data?.pagination?.imagePage ??
            1,
        );

        state.imageLimit = Number(
          data?.imageLimit ??
            data?.images?.limit ??
            data?.pagination?.imageLimit ??
            10,
        );

        state.imageTotal = Number(
          data?.imageTotal ??
            data?.images?.total ??
            data?.pagination?.imageTotal ??
            state.galleryImages.length,
        );

        state.imageTotalPages = Number(
          data?.imageTotalPages ??
            data?.images?.totalPages ??
            data?.images?.lastPage ??
            data?.pagination?.imageTotalPages ??
            Math.max(1, Math.ceil(state.imageTotal / state.imageLimit)),
        );

        state.videoPage = Number(
          data?.videoPage ??
            data?.videos?.page ??
            data?.videos?.currentPage ??
            data?.pagination?.videoPage ??
            1,
        );

        state.videoLimit = Number(
          data?.videoLimit ??
            data?.videos?.limit ??
            data?.pagination?.videoLimit ??
            10,
        );

        state.videoTotal = Number(
          data?.videoTotal ??
            data?.videos?.total ??
            data?.pagination?.videoTotal ??
            state.galleryVideos.length,
        );

        state.videoTotalPages = Number(
          data?.videoTotalPages ??
            data?.videos?.totalPages ??
            data?.videos?.lastPage ??
            data?.pagination?.videoTotalPages ??
            Math.max(1, Math.ceil(state.videoTotal / state.videoLimit)),
        );
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
  setImagePage,
  setImageLimit,
  setVideoPage,
  setVideoLimit,
} = gallerySlice.actions;

export default gallerySlice.reducer;
