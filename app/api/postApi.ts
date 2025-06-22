import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiUrl} from '../appConfig.ts';
import {BaseQueryFn, FetchArgs, FetchBaseQueryError} from '@reduxjs/toolkit/query';
import {clearCredentials} from '../store/authSlice.ts';

interface Post {
  post_type: string;
  id: string | number;
}

const baseQuery = fetchBaseQuery({
    baseUrl: `${apiUrl}/api/`,
    prepareHeaders: async headers => {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  });

export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> =
  async (args, api, extraOptions) => {
    // 1) Try original query
    const result = await baseQuery(args, api, extraOptions);
    console.log('리절트', result);
    // 2) If 401, attempt refresh
    if (result.error?.status === 401) {
      // 일단 로그아웃시킨다.
      api.dispatch(clearCredentials());
      alert('엑세스 토큰이 만료되었습니다. 다시 로그인해주세요');
      // const refreshResult = await baseQuery(
      //   { url: '/auth/refresh', method: 'POST', body: { token: api.getState().auth.refreshToken } },
      //   api,
      //   extraOptions
      // );
      // if (refreshResult.data) {
      //   // 3) Store new tokens
      //   api.dispatch(setCredentials(refreshResult.data as { accessToken: string; refreshToken: string }));
      //   // 4) Retry original query
      //   result = await baseQuery(args, api, extraOptions);
      // } else {
      //   // 5) Logout on refresh failure
      //   api.dispatch(logOut());
      // }
    }
    return result;
  };

export const postApiSlice = createApi({
  reducerPath: 'postApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Post'],
  endpoints: builder => ({
    getPosts: builder.query<Post[], void>({
      query: () => 'posts/',
      providesTags: result =>
        result
          ? [
              ...result.map(({id}) => ({type: 'Post' as const, id})),
              {type: 'Post' as const, id: 'LIST'},
            ]
          : [{type: 'Post' as const, id: 'LIST'}],
    }),
    getPost: builder.query<Post, string | number>({
      query: id => `posts/${id}/`,
      providesTags: (_result, _error, id) => [{type: 'Post', id}],
    }),
    addPost: builder.mutation<Post, Partial<Post>>({
      query: newPost => ({
        url: 'posts/',
        method: 'POST',
        body: newPost,
      }),
      invalidatesTags: [{type: 'Post', id: 'LIST'}],
    }),
    // updatePost, deletePost 등도 유사하게 정의
  }),
});

export const {useGetPostsQuery, useGetPostQuery, useAddPostMutation} =
  postApiSlice;
