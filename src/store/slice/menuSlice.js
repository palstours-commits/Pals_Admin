import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";

export const getMenus = createAsyncThunk(
  "menu/getMenus",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.accessToken;
    try {
      const response = await FetchApi({
        endpoint: "/admin/menu",
        method: "GET",
        token,
      });
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to fetch menus");
    }
  },
);

export const createMenu = createAsyncThunk(
  "menu/createMenu",
  async (payload, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.accessToken;
    try {
      const response = await FetchApi({
        endpoint: "/admin/menu",
        method: "POST",
        body: payload,
        token,
      });

      thunkAPI.dispatch(getMenus());
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to create menu");
    }
  },
);

export const updateMenu = createAsyncThunk(
  "menu/updateMenu",
  async ({ id, data }, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.accessToken;
    try {
      const response = await FetchApi({
        endpoint: `/admin/menu/${id}`,
        method: "PUT",
        body: data,
        token,
      });

      thunkAPI.dispatch(getMenus());
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to update menu");
    }
  },
);

export const deleteMenu = createAsyncThunk(
  "menu/deleteMenu",
  async (id, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.accessToken;
    try {
      await FetchApi({
        endpoint: `/admin/menu/${id}`,
        method: "DELETE",
        token,
      });
      thunkAPI.dispatch(getMenus());
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to delete menu");
    }
  },
);

export const restoreMenu = createAsyncThunk(
  "menu/restoreMenu",
  async (id, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.accessToken;
    try {
      await FetchApi({
        endpoint: `/admin/menu/${id}/restore`,
        method: "PATCH",
        token,
      });

      thunkAPI.dispatch(getMenus());
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to restore menu");
    }
  },
);

const menuSlice = createSlice({
  name: "menu",
  initialState: {
    menus: [],
    loading: false,
    actionLoading: false,
    error: null,
    message: null,
    deletedMessage: null,
    deletedError: null,
  },
  reducers: {
    clearMenuError(state) {
      state.error = null;
    },
    clearMenuMessage(state) {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMenus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMenus.fulfilled, (state, action) => {
        state.loading = false;
        state.menus = action.payload?.menus;
      })
      .addCase(getMenus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createMenu.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createMenu.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.message = action.payload?.message || "Menu created successfully";
      })
      .addCase(createMenu.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(updateMenu.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateMenu.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.message = action.payload?.message || "Menu updated successfully";
      })
      .addCase(updateMenu.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteMenu.pending, (state) => {
        state.actionLoading = true;
        state.deletedError = null;
      })
      .addCase(deleteMenu.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.deletedMessage =
          action.payload?.message || "Menu deleted successfully";
      })
      .addCase(deleteMenu.rejected, (state, action) => {
        state.actionLoading = false;
        state.deletedError = action.payload;
      })
      .addCase(restoreMenu.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(restoreMenu.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.message = action.payload?.message || "Menu restored successfully";
      })
      .addCase(restoreMenu.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMenuError, clearMenuMessage } = menuSlice.actions;
export default menuSlice.reducer;
