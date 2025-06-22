import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQueryWithReauth} from './postApi.ts';

interface Deal {
  post_type: string;
  id: string | number;
}

export const dealApiSlice = createApi({
  reducerPath: 'dealApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Deal'],
  endpoints: builder => ({
    getDeals: builder.infiniteQuery<
      {next: string | null; previous: string | null; results: Deal[]},
      void,
      string | null
    >({
      infiniteQueryOptions: {
        // 첫 호출 시 사용할 기본 커서 값
        initialPageParam: '',
        // 마지막 호출 결과에서 다음 커서를 계산하는 함수
        getNextPageParam: (lastPage) => {
          if (!lastPage.next) return undefined;
          const match = lastPage.next.match(/[?&]cursor=([^&]+)/);
          return match ? decodeURIComponent(match[1]) : null;
        },
      },
      query: ({ queryArg, pageParam }) => ({
        url: `/deals/?cursor=${pageParam}`,
        params: pageParam ? { cursor: pageParam } : {},
      }),
    }),
    getDeal: builder.query<Deal, string | number>({
      query: id => `deals/${id}/`,
      providesTags: (_result, _error, id) => [{type: 'Deal', id}],
    }),
  }),
});

export const {useGetDealsInfiniteQuery, useGetDealQuery} =
  dealApiSlice;