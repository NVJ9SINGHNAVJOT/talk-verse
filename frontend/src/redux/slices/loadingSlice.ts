import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type ApiCalls = Record<string, boolean>;

interface LoadingState {
  talkPageLd: boolean;
  apiCalls: ApiCalls;
}

const initialState = {
  talkPageLd: true,
  apiCalls: {},
} satisfies LoadingState as LoadingState;

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    setTalkPageLoading(state, action: PayloadAction<boolean>) {
      state.talkPageLd = action.payload;
    },
    setApiCall(state, action: PayloadAction<{ api: string; status: boolean }>) {
      state.apiCalls[action.payload.api] = action.payload.status;
    },
  },
});

export const { setTalkPageLoading, setApiCall } = loadingSlice.actions;
export default loadingSlice.reducer;
