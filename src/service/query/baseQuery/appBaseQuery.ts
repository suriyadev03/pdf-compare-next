/* eslint-disable @typescript-eslint/no-explicit-any */

import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const appBaseQuery = fetchBaseQuery({
  baseUrl: "",
  prepareHeaders: (headers) => {
    return headers;
  },
});


export { appBaseQuery };
