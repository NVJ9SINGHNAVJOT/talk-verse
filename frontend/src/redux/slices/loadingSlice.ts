import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type ApiCalls = Record<string, boolean>;

interface LoadingState {
    talkPageLd: boolean,
    createGroupLd: boolean,
    apiCalls: ApiCalls
}

const initialState = {
    talkPageLd: true,
    createGroupLd: false,
    apiCalls: {}
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
        setApiCall(state, action: PayloadAction<{ api: string, status: boolean }>) {
            state.apiCalls[action.payload.api] = action.payload.status;
        },
    },
});

export const {
    setTalkPageLoading, setCreateGroupLoading,
    setApiCall,
} = loadingSlice.actions;
export default loadingSlice.reducer;
