import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";

export const getBlogs = createAsyncThunk(
  "blog/getBlogs",
  async (params = {}, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: "/admin/blog",
        method: "GET",
        params,
        token,
      });

      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to fetch blogs");
    }
  },
);

export const getBlogById = createAsyncThunk(
  "blog/getBlogById",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/blog/${id}`,
        method: "GET",
        token,
      });

      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to fetch blog");
    }
  },
);

export const createBlog = createAsyncThunk(
  "blog/createBlog",
  async (payload, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: "/admin/blog",
        method: "POST",
        body: payload,
        token,
      });

      thunkAPI.dispatch(getBlogs());
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to create blog");
    }
  },
);

export const updateBlog = createAsyncThunk(
  "blog/updateBlog",
  async ({ id, data }, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/blog/${id}`,
        method: "PUT",
        body: data,
        token,
      });

      thunkAPI.dispatch(getBlogs());
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to update blog");
    }
  },
);

export const deleteBlog = createAsyncThunk(
  "blog/deleteBlog",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/blog/${id}`,
        method: "DELETE",
        token,
      });

      thunkAPI.dispatch(getBlogs());
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to delete blog");
    }
  },
);

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    blogs: [],
    singleBlog: null,
    loading: false,
    actionLoading: false,
    error: null,
    message: null,
    deletedMessage: null,
    deletedError: null,
  },
  reducers: {
    clearBlogError(state) {
      state.error = null;
      state.deletedError = null;
    },
    clearBlogMessage(state) {
      state.message = null;
      state.deletedMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload?.blogs || [];
      })
      .addCase(getBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getBlogById.fulfilled, (state, action) => {
        state.singleBlog = action.payload?.blog;
      })

      .addCase(createBlog.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.message = action.payload?.message || "Blog created successfully";
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      .addCase(updateBlog.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.message = action.payload?.message || "Blog updated successfully";
      })

      .addCase(deleteBlog.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.deletedMessage =
          action.payload?.message || "Blog deleted successfully";
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.actionLoading = false;
        state.deletedError = action.payload;
      });
  },
});

export const { clearBlogError, clearBlogMessage } = blogSlice.actions;

export default blogSlice.reducer;
