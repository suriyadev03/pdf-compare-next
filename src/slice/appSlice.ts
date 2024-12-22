import { DiffCheckApi } from "@/service/query/endpoints/diffCheckApi";
import { ParsePdfApi } from "@/service/query/endpoints/parsePDFApi";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IState {
  text1: string;
  text2: string;
  currentPage: number;
  numPages: number;
  diff: any[];
  diffCurrentWords: any[];
  pdf1Texts: any;
  pdf2Texts: any;
}

const initialState: IState = {
  text1: '',
  text2: '',
  currentPage: 2,
  numPages: 0,
  diff: [],
  diffCurrentWords: [],
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
      (state, action: PayloadAction<{ text1: string; text2: string; nextPage: number; diff: any[]; diffCurrentWords: any[]; currentPage: number, numPages: number, pdf1Texts: any, pdf2Texts: any }>) => {
        const { diff, currentPage } = action.payload;
        state.diff = [...state.diff, ...diff];
        state.diffCurrentWords = diff;
        state.currentPage = currentPage;
      }
    );
    builder.addMatcher(
      ParsePdfApi.endpoints.parsePdf.matchFulfilled,
      (state, action: PayloadAction<{ text1: string; text2: string; diff: any[]; nextPage: number; diffCurrentWords: any[]; currentPage: number, numPages: number, pdf1Texts: any, pdf2Texts: any }>) => {
        const { text1, text2, numPages, pdf1Texts, pdf2Texts } = action.payload;
        state.text1 = text1;
        state.text2 = text2;
        state.numPages = numPages;
        state.pdf1Texts = pdf1Texts;
        state.pdf2Texts = pdf2Texts;
      }
    );
  },
});

export default appSlice.reducer;
