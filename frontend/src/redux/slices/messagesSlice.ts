import { setUnseenCount } from "@/services/operations/notificationApi";
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

// Record<mainId, count>
export type UnseenMessages = Record<string, number>;

interface messagesState {
    pMess: SoMessageRecieved[],
    gpMess: GroupMessages[],
    currFriendId: string | undefined,
    currMainId: string | undefined,
    unseenMessages: UnseenMessages,
}

const initialState = {
    pMess: [],
    gpMess: [],
    currFriendId: undefined,
    currMainId: undefined,
    unseenMessages: {},
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
            if (!state.currMainId || aciton.payload[0].chatId !== state.currMainId) {
                const key = aciton.payload[0].chatId;
                setUnseenCount(key, state.unseenMessages[key] + 1);
                if (state.unseenMessages && key in state.unseenMessages) {
                    state.unseenMessages[key] += 1;
                }
            }
            else if (aciton.payload.length === 1) {
                state.pMess.unshift(aciton.payload[0]);
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
                state.gpMess.unshift(aciton.payload[0]);
            }
            else {
                state.gpMess = state.gpMess.concat(aciton.payload);
            }
        },

        // set ids for chat
        setCurrFriendId(state, aciton: PayloadAction<string>) {
            state.currFriendId = aciton.payload;
        },
        setMainId(state, action: PayloadAction<string>) {
            state.currMainId = action.payload;
        },

        // unseenMessages
        setUnseenMessages(state, action: PayloadAction<UnseenMessages>) {
            state.unseenMessages = action.payload;
        },
        addNewUnseen: (state, action: PayloadAction<string>) => {
            state.unseenMessages[action.payload] = 0;
        },
        resetUnseenMessage(state, action: PayloadAction<string>) {
            const key = action.payload;
            setUnseenCount(key, 0);
            if (state.unseenMessages && key in state.unseenMessages) {
                state.unseenMessages[key] = 0;
            }
        },
    },
});

export const { setPMessages, addPMessages,
    setGpMessages, addGpMessages,
    setCurrFriendId, setMainId,
    setUnseenMessages, addNewUnseen, resetUnseenMessage,
} = messagesSlice.actions;
export default messagesSlice.reducer;
