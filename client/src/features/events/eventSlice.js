import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/events/';

const initialState = {
  events: [],
  event: null,
  recommendations: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const getEvents = createAsyncThunk(
  'events/getAll',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(API_URL);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getEvent = createAsyncThunk(
  'events/getSingle',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(API_URL + id);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getRecommendations = createAsyncThunk(
  'events/getRecommendations',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get('/api/users/recommendations', {
        withCredentials: true
      });
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteEvent = createAsyncThunk(
  'events/delete',
  async (id, thunkAPI) => {
    try {
      const response = await axios.delete(API_URL + id, { withCredentials: true });
      return id;
    } catch (error) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const eventSlice = createSlice({
  name: 'event',
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
      .addCase(getEvents.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.events = action.payload;
      })
      .addCase(getEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getEvent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.event = action.payload;
      })
      .addCase(getEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getRecommendations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRecommendations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.recommendations = action.payload;
      })
      .addCase(getRecommendations.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteEvent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.events = state.events.filter((event) => event._id !== action.payload);
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = eventSlice.actions;
export default eventSlice.reducer;
