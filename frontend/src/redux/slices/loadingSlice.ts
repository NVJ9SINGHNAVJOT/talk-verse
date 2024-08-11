import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// NOTE: object below contains properties for reference only, not used for state rendering
type LoadingSliceObject = {
  apiCalls: Record<string, boolean>;
};
export const loadingSliceObject: LoadingSliceObject = {
  apiCalls: {},
};

interface LoadingState {
  talkPageLd: boolean;
  profilePageLd: boolean;
}

const initialState = {
  talkPageLd: true,
  profilePageLd: true,
} satisfies LoadingState as LoadingState;

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    setTalkPageLoading(state, action: PayloadAction<boolean>) {
      state.talkPageLd = action.payload;
    },
    setProfilePageLoading(state, action: PayloadAction<boolean>) {
      state.profilePageLd = action.payload;
    },
  },
});

export const { setTalkPageLoading, setProfilePageLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
