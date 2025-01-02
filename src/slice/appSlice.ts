import { DiffCheckApi } from "@/service/query/endpoints/diffCheckApi";
import { ParsePdfApi } from "@/service/query/endpoints/parsePDFApi";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IState {
  // currentPage: number;
  numPages: number;
  diff: any[];
  // diffCurrentWords: any[];
  pdf1Texts: any;
  pdf2Texts: any;
}

const initialState: IState = {
  // currentPage: 2,
  numPages: 0,
  diff: [],
  // diffCurrentWords: [],
  pdf1Texts: {},
  pdf2Texts: {},
};

const appSlice = createSlice({
  name: "appSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      DiffCheckApi.endpoints.diffCheck.matchFulfilled,
      (state, action: PayloadAction<{ diff: any[]; }>) => {
        const { diff } = action.payload;
        state.diff = [...state.diff, ...diff];
        // state.diffCurrentWords = diff;
        // state.currentPage = currentPage;
      }
    );
    builder.addMatcher(
      ParsePdfApi.endpoints.parsePdf.matchFulfilled,
      (state, action: PayloadAction<{ numPages: number, pdf1Texts: any, pdf2Texts: any }>) => {
        const { numPages, pdf1Texts, pdf2Texts } = action.payload;
        state.numPages = numPages;
        state.pdf1Texts = pdf1Texts;
        state.pdf2Texts = pdf2Texts;
      }
    );
  },
});

export default appSlice.reducer;
