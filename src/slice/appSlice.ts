import { DiffCheckApi } from "@/service/query/endpoints/diffCheckApi";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IState {
  text1: string;
  text2: string;
  currentPage: number;
  numPages: number;
  diff: any[];
  diffCurrentWords : any[];
}

const initialState: IState = {
  text1: '',
  text2: '',
  currentPage: 1,
  numPages: 0,
  diff: [],
  diffCurrentWords: [],
};

const appSlice = createSlice({
  name: "appSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      DiffCheckApi.endpoints.diffCheck.matchFulfilled,
      (state, action: PayloadAction<{ text1: string; text2: string; diff: any[]; diffCurrentWords: any[]; currentPage: number, numPages: number }>) => {
        const { text1, text2, diff, currentPage, numPages } = action.payload;
        state.text1 = text1;
        state.text2 = text2;
        state.numPages = numPages;
        state.diff = [...state.diff, ...diff];
        state.diffCurrentWords = diff;
        state.currentPage = currentPage;
      }
    );
  },
});

export default appSlice.reducer;
