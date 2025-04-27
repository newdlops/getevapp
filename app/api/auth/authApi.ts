// src/services/authApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://192.168.79.27:8000/api/' }),
  endpoints: (builder) => ({
    kakaoLogin: builder.mutation({
      query: (credentials) => ({
        url: 'kakaologin/',           // 로그인 엔드포인트
        method: 'POST',
        body: credentials,      // { email, password } 형식
      }),
    }),
    kakaoSignup: builder.mutation({
      query: (credentials) => ({
        url: 'kakaosignup/',
        method: 'POST',
        body: credentials,
      }),
    }),
    logout: builder.mutation({
      query: (credentials) => ({
        url: 'logout/',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

export const { useKakaoLoginMutation, useKakaoSignupMutation, useLogoutMutation } = authApi;
