import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";

export const getContacts = createAsyncThunk(
  "contactus/getContacts",
  async (params = {}, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: "/admin/contactus",
        method: "GET",
        params,
        token,
      });

      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to fetch contacts",
      );
    }
  },
);

export const getContactById = createAsyncThunk(
  "contactus/getContactById",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/contactus/${id}`,
        method: "GET",
        token,
      });

      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to fetch contact");
    }
  },
);

export const createContact = createAsyncThunk(
  "contactus/createContact",
  async (payload, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: "/admin/contactus",
        method: "POST",
        body: payload,
        token,
      });

      thunkAPI.dispatch(getContacts());
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to create contact",
      );
    }
  },
);

export const updateContact = createAsyncThunk(
  "contactus/updateContact",
  async ({ id, data }, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/contactus/${id}`,
        method: "PUT",
        body: data,
        token,
      });

      thunkAPI.dispatch(getContacts());
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to update contact",
      );
    }
  },
);

export const updateContactStatus = createAsyncThunk(
  "contactus/updateContactStatus",
  async ({ id, status }, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/contactus/${id}/status`,
        method: "PATCH",
        body: { status },
        token,
      });

      thunkAPI.dispatch(getContacts());
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to update contact status",
      );
    }
  },
);

export const deleteContact = createAsyncThunk(
  "contactus/deleteContact",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/contactus/${id}`,
        method: "DELETE",
        token,
      });

      thunkAPI.dispatch(getContacts());
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to delete contact",
      );
    }
  },
);

export const getContactStats = createAsyncThunk(
  "contactus/getContactStats",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: "/admin/contactus/stats",
        method: "GET",
        token,
      });

      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to fetch contact stats",
      );
    }
  },
);

const contactusSlice = createSlice({
  name: "contactus",
  initialState: {
    contacts: [],
    singleContact: null,
    stats: null,
    loading: false,
    actionLoading: false,
    error: null,
    message: null,
    deletedMessage: null,
    deletedError: null,
  },
  reducers: {
    clearContactError(state) {
      state.error = null;
      state.deletedError = null;
    },
    clearContactMessage(state) {
      state.message = null;
      state.deletedMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.contacts = action.payload?.messages;
      })
      .addCase(getContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getContactById.fulfilled, (state, action) => {
        state.singleContact = action.payload?.contact;
      })

      .addCase(createContact.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(createContact.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.message =
          action.payload?.message || "Contact created successfully";
      })
      .addCase(createContact.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      .addCase(updateContact.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.message =
          action.payload?.message || "Contact updated successfully";
      })

      .addCase(updateContactStatus.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.message =
          action.payload?.message || "Contact status updated successfully";
      })

      .addCase(deleteContact.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.deletedMessage =
          action.payload?.message || "Contact deleted successfully";
      })
      .addCase(deleteContact.rejected, (state, action) => {
        state.actionLoading = false;
        state.deletedError = action.payload;
      })

      .addCase(getContactStats.fulfilled, (state, action) => {
        state.stats = action.payload?.stats;
      });
  },
});

export const { clearContactError, clearContactMessage } =
  contactusSlice.actions;

export default contactusSlice.reducer;
