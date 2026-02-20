import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";

export const getOffers = createAsyncThunk(
  "offer/getOffers",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const res = await FetchApi({
        endpoint: "/admin/offer",
        method: "GET",
        token,
      });
      return res?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to fetch offers");
    }
  },
);

export const getOfferById = createAsyncThunk(
  "offer/getOfferById",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const res = await FetchApi({
        endpoint: `/admin/offer/${id}`,
        method: "GET",
        token,
      });
      return res?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to fetch offer");
    }
  },
);

export const createOffer = createAsyncThunk(
  "offer/createOffer",
  async (payload, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const res = await FetchApi({
        endpoint: "/admin/offer",
        method: "POST",
        body: payload,
        token,
      });

      thunkAPI.dispatch(getOffers());
      return res?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to create offer");
    }
  },
);

export const updateOffer = createAsyncThunk(
  "offer/updateOffer",
  async ({ id, data }, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const res = await FetchApi({
        endpoint: `/admin/offer/${id}`,
        method: "PUT",
        body: data,
        token,
      });

      thunkAPI.dispatch(getOffers());
      return res?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to update offer");
    }
  },
);

export const deleteOffer = createAsyncThunk(
  "offer/deleteOffer",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const res = await FetchApi({
        endpoint: `/admin/offer/${id}`,
        method: "DELETE",
        token,
      });

      thunkAPI.dispatch(getOffers());
      return res?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to delete offer");
    }
  },
);

export const restoreOffer = createAsyncThunk(
  "offer/restoreOffer",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const res = await FetchApi({
        endpoint: `/admin/offer/${id}/restore`,
        method: "PATCH",
        token,
      });

      thunkAPI.dispatch(getOffers());
      return res?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to restore offer");
    }
  },
);

export const getOfferCategories = createAsyncThunk(
  "offer/getOfferCategories",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const res = await FetchApi({
        endpoint: "/admin/offer/getall/categories",
        method: "GET",
        token,
      });
      return res?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to fetch categories",
      );
    }
  },
);

const offerSlice = createSlice({
  name: "offer",
  initialState: {
    offers: [],
    singleOffer: null,
    categories: [],
    loading: false,
    actionLoading: false,
    error: null,
    message: null,
    deletedMessage: null,
  },
  reducers: {
    clearOfferError(state) {
      state.error = null;
    },
    clearOfferMessage(state) {
      state.message = null;
    },
    clearDeletedOfferMessage(state) {
      state.deletedMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOffers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOffers.fulfilled, (state, action) => {
        state.loading = false;
        state.offers = action.payload?.offers || [];
      })
      .addCase(getOffers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getOfferById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOfferById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleOffer = action.payload || null;
      })
      .addCase(getOfferById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createOffer.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(createOffer.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.message = action.payload?.message || "Offer created successfully";
      })
      .addCase(createOffer.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      .addCase(updateOffer.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(updateOffer.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.message = action.payload?.message || "Offer updated successfully";
      })
      .addCase(updateOffer.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      .addCase(deleteOffer.pending, (state) => {
        state.actionLoading = true;
        state.deletedMessage = null;
        state.error = null;
      })
      .addCase(deleteOffer.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.deletedMessage =
          action.payload?.message || "Offer deleted successfully";
      })
      .addCase(deleteOffer.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      .addCase(restoreOffer.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(restoreOffer.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.message =
          action.payload?.message || "Offer restored successfully";
      })
      .addCase(restoreOffer.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      .addCase(getOfferCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOfferCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload?.categories || [];
      })
      .addCase(getOfferCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOfferError, clearOfferMessage, clearDeletedOfferMessage } =
  offerSlice.actions;

export default offerSlice.reducer;
