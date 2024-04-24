import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


interface PageLoadingState {
    pageLoading: boolean,
}

const initialState = {
    pageLoading: false,
} satisfies PageLoadingState as PageLoadingState;

const pageLoadingSlice = createSlice({
    name: "pageLoading",
    initialState,
    reducers: {
        setPageLoading(state, action: PayloadAction<boolean>) {
            state.pageLoading = action.payload;
        },
    },
});

export const { setPageLoading } = pageLoadingSlice.actions;
export default pageLoadingSlice.reducer;
