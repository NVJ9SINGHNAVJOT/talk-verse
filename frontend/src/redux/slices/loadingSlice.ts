import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


interface LoadingState {
    talkPageLd: boolean,
    createGroupLd: boolean,
    workModal: boolean,
}

const initialState = {
    talkPageLd: true,
    createGroupLd: false,
    workModal: false,
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
        setWorkModal(state, action: PayloadAction<boolean>) {
            state.workModal = action.payload;
        }
    },
});

export const { setTalkPageLoading, setCreateGroupLoading, setWorkModal } = loadingSlice.actions;
export default loadingSlice.reducer;
