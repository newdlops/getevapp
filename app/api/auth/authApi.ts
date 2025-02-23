import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    login: builder.mutation({
      queryFn: async (credentials) => {
        // 500ms 딜레이로 목업 응답 시뮬레이션
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (credentials.username === 'test' && credentials.password === 'password') {
          return { data: { token: 'fake-token', user: { username: 'test' } } };
        }
        return { error: { status: 401, data: 'Invalid credentials' } };
      },
    }),
  }),
});

export const { useLoginMutation } = authApi;
