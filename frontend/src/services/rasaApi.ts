import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const rasaApi = createApi({
  reducerPath: 'rasaApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5005/webhooks/rest/webhook',
  }),
  endpoints: (builder) => ({
    sendMessage: builder.mutation<
      { recipient_id: string; text: string }[], // risposta
      { sender: string; message: string }       // richiesta
    >({
      query: (body) => ({
        url: '',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useSendMessageMutation } = rasaApi;
