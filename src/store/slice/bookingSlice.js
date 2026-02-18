import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { FetchApi } from "../../api/FetchApi";


export const getBookings = createAsyncThunk(
    "booking/getBookings",
    async (_, thunkAPI) => {
        const token = thunkAPI.getState()?.auth?.accessToken;
        try {
            const response = await FetchApi({
                endpoint: "/admin/bookings",
                method: "GET",
                token,
            });

            return response?.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.message || "Failed to fetch bookings"
            );
        }
    }
);

export const getBookingById = createAsyncThunk(
    "booking/getBookingById",
    async (id, thunkAPI) => {
        const token = thunkAPI.getState()?.auth?.accessToken;
        try {
            const response = await FetchApi({
                endpoint: `/admin/bookings/${id}`,
                method: "GET",
                token,
            });
            return response?.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.message || "Failed to fetch booking"
            );
        }
    }
);


export const createBooking = createAsyncThunk(
    "booking/createBooking",
    async (payload, thunkAPI) => {
        const token = thunkAPI.getState()?.auth?.accessToken;
        try {
            const response = await FetchApi({
                endpoint: "/admin/bookings",
                method: "POST",
                body: payload,
                token,
            });

            thunkAPI.dispatch(getBookings());
            return response?.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.message || "Failed to create booking"
            );
        }
    }
);


export const updateBooking = createAsyncThunk(
    "booking/updateBooking",
    async ({ id, data }, thunkAPI) => {
        const token = thunkAPI.getState()?.auth?.accessToken;
        try {
            const response = await FetchApi({
                endpoint: `/admin/bookings/${id}`,
                method: "PUT",
                body: data,
                token,
            });
            thunkAPI.dispatch(getBookings());
            return response?.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.message || "Failed to update booking"
            );
        }
    }
);


export const updateBookingStatus = createAsyncThunk(
    "booking/updateBookingStatus",
    async ({ id, status }, thunkAPI) => {
        const token = thunkAPI.getState()?.auth?.accessToken;
        try {
            const response = await FetchApi({
                endpoint: `/admin/bookings/${id}/status`,
                method: "PATCH",
                body: { status },
                token,
            });

            thunkAPI.dispatch(getBookings());
            return response?.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.message || "Failed to update booking status"
            );
        }
    }
);


export const deleteBooking = createAsyncThunk(
    "booking/deleteBooking",
    async (id, thunkAPI) => {
        const token = thunkAPI.getState()?.auth?.accessToken;

        try {
            const response = await FetchApi({
                endpoint: `/admin/bookings/${id}`,
                method: "DELETE",
                token,
            });

            return response?.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.message || "Failed to delete booking"
            );
        }
    }
);



export const getBookingStats = createAsyncThunk(
    "booking/getBookingStats",
    async (_, thunkAPI) => {
        const token = thunkAPI.getState()?.auth?.accessToken;

        try {
            const response = await FetchApi({
                endpoint: "/admin/bookings/stats",
                method: "GET",
                token,
            });

            return response?.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(
                err.message || "Failed to fetch stats"
            );
        }
    }
);


const bookingSlice = createSlice({
    name: "booking",
    initialState: {
        bookings: [],
        
        singleBooking: null,
        stats: null,
        loading: false,
        actionLoading: false,
        error: null,
        message: null,
        deletedMessage: null,
        deletedError: null,
    },
    reducers: {
        clearBookingError(state) {
            state.error = null;
            state.deletedError = null;
        },
        clearBookingMessage(state) {
            state.message = null;
            state.deletedMessage = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getBookings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getBookings.fulfilled, (state, action) => {
                state.loading = false;
                const data = action.payload;
                state.bookings =
                    data?.bookings ||
                    data?.data ||
                    data?.messages ||
                    data ||
                    [];
            })

            .addCase(getBookings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getBookingById.fulfilled, (state, action) => {
                state.singleBooking = action.payload?.booking;
            })
            .addCase(createBooking.pending, (state) => {
                state.actionLoading = true;
            })
            .addCase(createBooking.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.message =
                    action.payload?.message || "Booking created successfully";
            })

            .addCase(updateBooking.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.message =
                    action.payload?.message || "Booking updated successfully";
            })

            .addCase(updateBookingStatus.fulfilled, (state, action) => {
                state.actionLoading = false;
                state.message =
                    action.payload?.message || "Booking status updated";
            })

            .addCase(deleteBooking.pending, (state) => {
                state.actionLoading = true;
            })
            .addCase(deleteBooking.fulfilled, (state, action) => {
  state.actionLoading = false;
  state.deletedMessage =
    action.payload?.message || "Booking deleted";

  const deletedId = action.meta.arg;

  state.bookings = state.bookings.filter(
    (item) => item._id !== deletedId
  );
})


            .addCase(deleteBooking.rejected, (state, action) => {
                state.actionLoading = false;
                state.deletedError = action.payload;
            })
            .addCase(getBookingStats.fulfilled, (state, action) => {
                state.stats = action.payload?.stats;
            });
    },
});

export const { clearBookingError, clearBookingMessage } =
    bookingSlice.actions;

export default bookingSlice.reducer;
