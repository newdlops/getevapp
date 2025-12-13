import {createApi} from '@reduxjs/toolkit/query/react';
import {baseQueryWithReauth} from './postApi.ts';

export interface Deal {
  post_type: string;
  id: string | number;
}

export interface DealsPage {
  next: string | null;
  previous: string | null;
  results: Deal[];
}

export function getCursorFromUrl(url: string | null): string | null {
  if (!url) return null;
  const match = url.match(/[?&]cursor=([^&]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export const dealApiSlice = createApi({
  reducerPath: 'dealApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Deal'],
  endpoints: builder => ({
    getDeals: builder.query<DealsPage, string | null | void>({
      query: cursor => {
        const queryString = cursor ? `?cursor=${encodeURIComponent(cursor)}` : '';
        return `deals/${queryString}`;
      },
    }),
    getDeal: builder.query<Deal, string | number>({
      query: id => `deals/${id}/`,
      providesTags: (_result, _error, id) => [{type: 'Deal', id}],
    }),
  }),
});

export const {useGetDealsQuery, useLazyGetDealsQuery, useGetDealQuery} =
  dealApiSlice;
