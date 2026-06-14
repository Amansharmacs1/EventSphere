import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import eventReducer from '../features/events/eventSlice';
import ticketReducer from '../features/tickets/ticketSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    event: eventReducer,
    ticket: ticketReducer,
  },
});
