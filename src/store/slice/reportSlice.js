import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";

export const getReports = createAsyncThunk(
  "report/getReports",
  async (params = {}, thunkAPI) => {
    const token = thunkAPI.getState()?.auth?.accessToken;

    try {
      const query = new URLSearchParams();

      if (params.filterType) query.append("filterType", params.filterType);
      if (params.month) query.append("month", params.month);
      if (params.year) query.append("year", params.year);
      if (params.fromDate) query.append("fromDate", params.fromDate);
      if (params.toDate) query.append("toDate", params.toDate);

      const endpoint = query.toString()
        ? `/admin/report?${query}`
        : "/admin/report";

      const response = await FetchApi({
        endpoint,
        method: "GET",
        token,
      });

      return response?.data
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to fetch reports");
    }
  },
);

const reportSlice = createSlice({
  name: "report",
  initialState: {
    summaryCounts: null,
    chartData: [],
    filterApplied: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearReportError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReports.fulfilled, (state, action) => {
        state.loading = false;
        state.summaryCounts = action.payload?.summaryCounts || null;
        state.chartData = action.payload?.chartData || [];
        state.filterApplied = action.payload?.filterApplied || null;
      })
      .addCase(getReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearReportError } = reportSlice.actions;
export default reportSlice.reducer;
