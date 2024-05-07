import { SMessageRecieved } from "@/types/scoket/eventTypes";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type GroupMessages = {
    uuId: string,
    isFile: boolean,
    from: {
        _id: string,
        firstName: string,
        lastName: string,
        imageUrl?: string
    }
    text: string,
    createdAt: Date
}

interface messagesState {
    pMess: SMessageRecieved[],
    gpMess: GroupMessages[]
}

const initialState = {
    pMess: [],
    gpMess: []
} satisfies messagesState as messagesState;

const messagesSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        setPMessages(state, action: PayloadAction<SMessageRecieved[]>) {
            state.pMess = action.payload;
        },
        addPMessages(state, aciton: PayloadAction<SMessageRecieved[]>) {
            state.pMess.concat(aciton.payload);
        },
        setGpMessages(state, action: PayloadAction<GroupMessages[]>) {
            state.gpMess = action.payload;
        },
        addGpMessages(state, aciton: PayloadAction<GroupMessages[]>) {
            state.gpMess.concat(aciton.payload);
        }
    },
});

export const { setPMessages } = messagesSlice.actions;
export default messagesSlice.reducer;
