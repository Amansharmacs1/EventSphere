import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/tickets/';

const initialState = {
  tickets: [],
  ticket: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const getMyTickets = createAsyncThunk(
  'tickets/getMy',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(API_URL + 'my', {
        withCredentials: true
      });
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const ticketSlice = createSlice({
  name: 'ticket',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyTickets.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyTickets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tickets = action.payload;
      })
      .addCase(getMyTickets.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = ticketSlice.actions;
export default ticketSlice.reducer;
