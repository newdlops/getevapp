import { createApi } from '@reduxjs/toolkit/query/react';
import {baseQueryWithReauth} from './postApi.ts';

export const commentApi = createApi({
  reducerPath: 'commentApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Comment'],
  endpoints: (builder) => ({
    // 1) 특정 게시글의 댓글 목록 조회
    getComments: builder.query({
      query: (postId) => `posts/${postId}/comments/`,
      providesTags: (result, error, postId) =>
        result
          ? [
              ...((result as Array<{ id: string | number }>)?.map(({ id }) => ({ type: 'Comment' as const, id })) || []),
              { type: 'Comment' as const, id: `LIST_${postId}` },
            ]
          : [{ type: 'Comment' as const, id: `LIST_${postId}` }],
    }),

    // 2) 댓글에 대한 대댓글(Reply) 조회
    getReplies: builder.query({
      query: ({ postId, commentId }: { postId: number; commentId: number }) => `posts/${postId}/comments/${commentId}/`,
      providesTags: (result, error, { commentId }) =>
        result
          ? [
            ...(Array.isArray(result)
              ? (result as Array<{ id: string | number }>).map(({ id }) => ({ type: 'Comment' as const, id }))
              : []),
            { type: 'Comment' as const, id: commentId },
          ]
          : [{ type: 'Comment' as const, id: commentId }],
    }),

    // 3) 새 댓글 추가
    addComment: builder.mutation({
      query: ({ postId, content } : { postId: number; content: unknown; }) => ({
        url: `posts/${postId}/comments/`,
        method: 'POST',
        body: { content },
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: 'Comment', id: `LIST_${postId}` },
      ],
    }),

    // 4) 새 대댓글 추가
    addReply: builder.mutation({
      query: ({ postId, commentId, content } : { postId: number; commentId: number ; content: unknown; }) => ({
        url: `posts/${postId}/comments/${commentId}/`,
        method: 'POST',
        body: { content },
      }),
      invalidatesTags: (result, error, { commentId }) => [
        { type: 'Comment', id: commentId },
      ],
    }),

    // 5) 댓글 수정
    updateComment: builder.mutation({
      query: ({ postId, commentId, content }: { postId: number; commentId: number ; content: unknown; }) => ({
        url: `posts/${postId}/comments/${commentId}/detail/`,
        method: 'PATCH',
        body: { content },
      }),
      invalidatesTags: (result, error, { commentId }) => [
        { type: 'Comment', id: commentId },
      ],
    }),

    // 6) 댓글 삭제
    deleteComment: builder.mutation({
      query: ({ postId, commentId }) => ({
        url: `posts/${postId}/comments/${commentId}/detail/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: 'Comment', id: `LIST_${postId}` },
      ],
    }),
  }),
});

export const {
  useGetCommentsQuery,
  useGetRepliesQuery,
  useAddCommentMutation,
  useAddReplyMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = commentApi;
