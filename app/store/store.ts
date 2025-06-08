// store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import { authApi } from '../api/auth/authApi';
import { postApiSlice } from '../api/postApi';
import { commentApi } from '../api/commentApi.ts';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [postApiSlice.reducerPath]: postApiSlice.reducer,
    [commentApi.reducerPath]: commentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([authApi.middleware, postApiSlice.middleware, commentApi.middleware]),
  devTools: true,
});
