import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiUrl} from '../appConfig.ts';

interface Post {
  id: string | number;
}

export const postApiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}/api/`,
    prepareHeaders: async headers => {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
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
