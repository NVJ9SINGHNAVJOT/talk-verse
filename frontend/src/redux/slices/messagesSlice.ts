import { SoMessageRecieved } from "@/types/socket/eventTypes";
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
    createdAt: string
}

interface messagesState {
    pMess: SoMessageRecieved[],
    gpMess: GroupMessages[],
    currFriendId: string | undefined
}

const initialState = {
    pMess: [],
    gpMess: [],
    currFriendId: undefined
} satisfies messagesState as messagesState;

const messagesSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        // two users chat messages
        setPMessages(state, action: PayloadAction<SoMessageRecieved[]>) {
            state.pMess = action.payload;
        },
        addPMessages(state, aciton: PayloadAction<SoMessageRecieved[]>) {
            if (aciton.payload.length === 1) {
                state.pMess.push(aciton.payload[0]);
            }
            else {
                state.pMess = state.pMess.concat(aciton.payload);
            }
        },
        // group chat messages
        setGpMessages(state, action: PayloadAction<GroupMessages[]>) {
            state.gpMess = action.payload;
        },
        addGpMessages(state, aciton: PayloadAction<GroupMessages[]>) {
            if (aciton.payload.length === 1) {
                state.gpMess.push(aciton.payload[0]);
            }
            else {
                state.gpMess.concat(aciton.payload);
            }
        },
        setCurrFriendId(state, aciton: PayloadAction<string>) {
            state.currFriendId = aciton.payload;
        }
    },
});

export const { setPMessages, addPMessages, setGpMessages, addGpMessages, setCurrFriendId } = messagesSlice.actions;
export default messagesSlice.reducer;
