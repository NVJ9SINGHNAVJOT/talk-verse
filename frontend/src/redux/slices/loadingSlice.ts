import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


interface LoadingState {
    talkPageLoading: boolean,
}

const initialState = {
    talkPageLoading: true,
} satisfies LoadingState as LoadingState;

const loadingSlice = createSlice({
    name: "loading",
    initialState,
    reducers: {
        setTalkPageLoading(state, action: PayloadAction<boolean>) {
            state.talkPageLoading = action.payload;
        },
    },
});

export const { setTalkPageLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
