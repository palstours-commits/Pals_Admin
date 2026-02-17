import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";

export const getEnquiries = createAsyncThunk(
  "enquiry/getEnquiries",
  async (params = {}, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: "/admin/enquiries",
        method: "GET",
        params,
        token,
      });
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to fetch enquiries",
      );
    }
  },
);

export const getEnquiryById = createAsyncThunk(
  "enquiry/getEnquiryById",
  async (id, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/enquiries/${id}`,
        method: "GET",
        token,
      });
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to fetch enquiry");
    }
  },
);

export const createEnquiry = createAsyncThunk(
  "enquiry/createEnquiry",
  async (payload, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: "/admin/enquiries",
        method: "POST",
        body: payload,
        token,
      });

      thunkAPI.dispatch(getEnquiries());
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to create enquiry",
      );
    }
  },
);

export const updateEnquiry = createAsyncThunk(
  "enquiry/updateEnquiry",
  async ({ id, data }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/enquiries/${id}`,
        method: "PUT",
        body: data,
        token,
      });

      thunkAPI.dispatch(getEnquiries());
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to update enquiry",
      );
    }
  },
);

export const updateEnquiryStatus = createAsyncThunk(
  "enquiry/updateEnquiryStatus",
  async ({ id, status }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/enquiries/${id}/status`,
        method: "PATCH",
        body: { status },
        token,
      });

      thunkAPI.dispatch(getEnquiries());
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to update enquiry status",
      );
    }
  },
);

export const deleteEnquiry = createAsyncThunk(
  "enquiry/deleteEnquiry",
  async ({ deleteId }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.accessToken;

    await FetchApi({
      endpoint: `/admin/enquiries/${deleteId}`,
      method: "DELETE",
      token,
    });

    thunkAPI.dispatch(getEnquiries());
    return deleteId;
  },
);

export const getEnquiryStats = createAsyncThunk(
  "enquiry/getEnquiryStats",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: "/admin/enquiries/stats",
        method: "GET",
        token,
      });
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to fetch enquiry stats",
      );
    }
  },
);

const enquirySlice = createSlice({
  name: "enquiry",
  initialState: {
    enquiries: [],
    singleEnquiry: null,
    stats: null,
    loading: false,
    actionLoading: false,
    error: null,
    message: null,
    deletedMessage: null,
    deletedError: null,
  },
  reducers: {
    clearEnquiryError(state) {
      state.error = null;
      state.deletedError = null;
    },
    clearEnquiryMessage(state) {
      state.message = null;
      state.deletedMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEnquiries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEnquiries.fulfilled, (state, action) => {
        state.loading = false;
        state.enquiries = action.payload?.enquiries;
      })
      .addCase(getEnquiries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getEnquiryById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getEnquiryById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleEnquiry = action.payload?.enquiry;
      })
      .addCase(getEnquiryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createEnquiry.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(createEnquiry.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.message =
          action.payload?.message || "Enquiry created successfully";
      })
      .addCase(createEnquiry.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(updateEnquiry.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(updateEnquiry.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.message =
          action.payload?.message || "Enquiry updated successfully";
      })
      .addCase(updateEnquiry.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(updateEnquiryStatus.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(updateEnquiryStatus.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.message =
          action.payload?.message || "Enquiry status updated successfully";
      })
      .addCase(updateEnquiryStatus.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteEnquiry.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(deleteEnquiry.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.deletedMessage =
          action.payload?.message || "Enquiry deleted successfully";
      })
      .addCase(deleteEnquiry.rejected, (state, action) => {
        state.actionLoading = false;
        state.deletedError = action.payload;
      })
      .addCase(getEnquiryStats.fulfilled, (state, action) => {
        state.stats = action.payload?.stats;
      });
  },
});

export const { clearEnquiryError, clearEnquiryMessage } = enquirySlice.actions;

export default enquirySlice.reducer;
