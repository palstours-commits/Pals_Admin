import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";

export const getSubMenus = createAsyncThunk(
  "submenu/getSubMenus",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: "/admin/submenu",
        method: "GET",
        token,
      });

      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to fetch submenus",
      );
    }
  },
);

export const getSubMenuById = createAsyncThunk(
  "submenu/getSubMenuById",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/submenu/${id}`,
        method: "GET",
        token,
      });

      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to fetch submenu");
    }
  },
);

export const createSubMenu = createAsyncThunk(
  "submenu/createSubMenu",
  async (payload, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: "/admin/submenu",
        method: "POST",
        body: payload,
        token,
      });

      thunkAPI.dispatch(getSubMenus());
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to create submenu",
      );
    }
  },
);

export const updateSubMenu = createAsyncThunk(
  "submenu/updateSubMenu",
  async ({ id, data }, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/submenu/${id}`,
        method: "PUT",
        body: data,
        token,
      });

      thunkAPI.dispatch(getSubMenus());
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to update submenu",
      );
    }
  },
);

export const deleteSubMenu = createAsyncThunk(
  "submenu/deleteSubMenu",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/submenu/${id}`,
        method: "DELETE",
        token,
      });

      thunkAPI.dispatch(getSubMenus());
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to delete submenu",
      );
    }
  },
);

export const restoreSubMenu = createAsyncThunk(
  "submenu/restoreSubMenu",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/submenu/${id}/restore`,
        method: "PATCH",
        token,
      });

      thunkAPI.dispatch(getSubMenus());
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to restore submenu",
      );
    }
  },
);

const submenuSlice = createSlice({
  name: "submenu",
  initialState: {
    submenus: [],
    selectedSubmenu: null,
    loading: false,
    actionLoading: false,
    error: null,
    message: null,
    deletedMessage: null,
    deletedError: null,
  },
  reducers: {
    clearSubMenuError(state) {
      state.error = null;
    },
    clearSubMenuMessage(state) {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSubMenus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSubMenus.fulfilled, (state, action) => {
        state.loading = false;
        state.submenus = action.payload?.items;
      })
      .addCase(getSubMenus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getSubMenuById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSubMenuById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSubmenu = action.payload?.submenu;
      })
      .addCase(getSubMenuById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createSubMenu.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createSubMenu.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.message =
          action.payload?.message || "Submenu created successfully";
      })
      .addCase(createSubMenu.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(updateSubMenu.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateSubMenu.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.message =
          action.payload?.message || "Submenu updated successfully";
      })
      .addCase(updateSubMenu.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteSubMenu.pending, (state) => {
        state.actionLoading = true;
        state.deletedError = null;
      })
      .addCase(deleteSubMenu.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.deletedMessage =
          action.payload?.message || "Submenu deleted successfully";
      })
      .addCase(deleteSubMenu.rejected, (state, action) => {
        state.actionLoading = false;
        state.deletedError = action.payload;
      })
      .addCase(restoreSubMenu.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(restoreSubMenu.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.message =
          action.payload?.message || "Submenu restored successfully";
      })
      .addCase(restoreSubMenu.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSubMenuError, clearSubMenuMessage } = submenuSlice.actions;

export default submenuSlice.reducer;
