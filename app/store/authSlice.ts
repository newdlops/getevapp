// src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: null,
  accessToken: null,
  refreshToken: null,
  email: null,
  userId: null,
  isLogged: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.id = action.payload.id;
      state.accessToken = action.payload.access_token;
      state.refreshToken = action.payload.refresh_token;
      state.email = action.payload.email;
      state.userId = action.payload.user_id;
      state.isLogged = action.payload.isLogged;
    },
    clearCredentials: (state) => {
      state.id = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.email = null;
      state.userId = null;
      state.isLogged = false;
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions

export const selectCurrentUser = (state) => {
  return state.auth};
// 또는 필요한 경우 accessToken만 선택할 수도 있습니다.
export const selectAccessToken = (state) => state.auth.accessToken;

export default authSlice.reducer;
