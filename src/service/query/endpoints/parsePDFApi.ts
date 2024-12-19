import { createApi } from "@reduxjs/toolkit/query/react";
import { appBaseQuery } from "../baseQuery/appBaseQuery";

// API for PDF parsing
export const ParsePdfApi = createApi({
  reducerPath: "ParsePdfApi",
  baseQuery: appBaseQuery,
  endpoints: (builder) => ({
    parsePdf: builder.mutation({
      query: (pdfData: { pdf1: File; pdf2: File }) => {
        const formData = new FormData();
        formData.append("pdf1", pdfData.pdf1);
        formData.append("pdf2", pdfData.pdf2);

        return {
          url: 'api/parsePDF',
          method: "POST",
          body: formData,
        };
      },
      transformResponse: (response: any) => response, 
    }),
  }),
});


export const { useParsePdfMutation } = ParsePdfApi;
