import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


interface PageLoadingState {
    talkPageLoading: boolean,
}

const initialState = {
    talkPageLoading: true,
} satisfies PageLoadingState as PageLoadingState;

const pageLoadingSlice = createSlice({
    name: "pageLoading",
    initialState,
    reducers: {
        setTalkPageLoading(state, action: PayloadAction<boolean>) {
            state.talkPageLoading = action.payload;
        },
    },
});

export const { setTalkPageLoading } = pageLoadingSlice.actions;
export default pageLoadingSlice.reducer;
