import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


interface LoadingState {
    talkPageLd: boolean,
    createGroupLd: boolean,
}

const initialState = {
    talkPageLd: true,
    createGroupLd: false,
} satisfies LoadingState as LoadingState;

const loadingSlice = createSlice({
    name: "loading",
    initialState,
    reducers: {
        setTalkPageLoading(state, action: PayloadAction<boolean>) {
            state.talkPageLd = action.payload;
        },
        setCreateGroupLoading(state, action: PayloadAction<boolean>) {
            state.createGroupLd = action.payload;
        },
    },
});

export const { setTalkPageLoading, setCreateGroupLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
