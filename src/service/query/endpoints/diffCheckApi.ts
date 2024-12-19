import { createApi } from "@reduxjs/toolkit/query/react";
import { appBaseQuery } from "../baseQuery/appBaseQuery";

export const DiffCheckApi = createApi({
  reducerPath: "DiffCheckApi",
  baseQuery: appBaseQuery,
  endpoints: (builder) => ({
    diffCheck: builder.mutation({
      query: (diffRequest: { text1: string; text2: string, nextPage: number, numPages: number }) => {

        return {
          url: 'api/checkDiff',
          method: "POST",
          body: diffRequest,
        };
      },
      transformResponse: (response: any) => response,
    }),
  }),
});

export const { useDiffCheckMutation } = DiffCheckApi;
