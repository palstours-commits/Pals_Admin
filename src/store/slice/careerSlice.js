import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";

export const getCareers = createAsyncThunk(
  "career/getCareers",
  async (params = {}, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: "/admin/career",
        method: "GET",
        params,
        token,
      });

      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to fetch career applications",
      );
    }
  },
);

export const getCareerById = createAsyncThunk(
  "career/getCareerById",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/career/${id}`,
        method: "GET",
        token,
      });

      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to fetch career application",
      );
    }
  },
);

export const updateCareerStatus = createAsyncThunk(
  "career/updateCareerStatus",
  async ({ id, data }, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/career/${id}`,
        method: "PUT",
        body: data,
        token,
      });

      thunkAPI.dispatch(getCareers());
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to update career status",
      );
    }
  },
);

export const deleteCareer = createAsyncThunk(
  "career/deleteCareer",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const response = await FetchApi({
        endpoint: `/admin/career/${id}`,
        method: "DELETE",
        token,
      });

      thunkAPI.dispatch(getCareers());
      return response?.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.message || "Failed to delete career application",
      );
    }
  },
);

const careerSlice = createSlice({
  name: "career",
  initialState: {
    careers: [],
    singleCareer: null,
    loading: false,
    actionLoading: false,
    error: null,
    message: null,
    deletedMessage: null,
    deletedError: null,
  },
  reducers: {
    clearCareerError(state) {
      state.error = null;
      state.deletedError = null;
    },
    clearCareerMessage(state) {
      state.message = null;
      state.deletedMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCareers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCareers.fulfilled, (state, action) => {
        state.loading = false;
        state.careers = action.payload?.careers || [];
      })
      .addCase(getCareers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getCareerById.fulfilled, (state, action) => {
        state.singleCareer = action.payload?.career;
      })

      .addCase(updateCareerStatus.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(updateCareerStatus.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.message =
          action.payload?.message || "Career status updated successfully";
      })
      .addCase(updateCareerStatus.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      .addCase(deleteCareer.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(deleteCareer.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.deletedMessage =
          action.payload?.message || "Career application deleted successfully";
      })
      .addCase(deleteCareer.rejected, (state, action) => {
        state.actionLoading = false;
        state.deletedError = action.payload;
      });
  },
});

export const { clearCareerError, clearCareerMessage } = careerSlice.actions;

export default careerSlice.reducer;
