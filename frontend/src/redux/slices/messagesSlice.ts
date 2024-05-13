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
    },
    to: string,
    text: string,
    createdAt: string
}

// Record<mainId, count>
export type UnseenMessages = Record<string, number>;

interface messagesState {
    pMess: SoMessageRecieved[],
    gpMess: GroupMessages[],
    currFriendId: string | undefined,
    mainChatId: string | undefined,
    mainGroupId: string | undefined,
    unseenMessages: UnseenMessages,
}

const initialState = {
    pMess: [],
    gpMess: [],
    currFriendId: undefined,
    mainChatId: undefined,
    mainGroupId: undefined,
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
        addPMessages(state, action: PayloadAction<SoMessageRecieved[]>) {
            state.pMess = state.pMess.concat(action.payload);
        },
        addLivePMessage(state, action: PayloadAction<SoMessageRecieved>) {
            if (state.mainChatId && action.payload.chatId === state.mainChatId) {
                state.pMess.unshift(action.payload);
            }
            else {
                const key = action.payload.chatId;
                setUnseenCount(key, state.unseenMessages[key] + 1);
                if (state.unseenMessages && key in state.unseenMessages) {
                    state.unseenMessages[key] += 1;
                }
            }
        },

        // group chat messages
        setGpMessages(state, action: PayloadAction<GroupMessages[]>) {
            state.gpMess = action.payload;
        },
        addGpMessages(state, action: PayloadAction<GroupMessages[]>) {
            state.gpMess = state.gpMess.concat(action.payload);
        },
        addLiveGpMessage(state, action: PayloadAction<GroupMessages>) {
            if (state.mainGroupId && action.payload.to === state.mainGroupId) {
                state.gpMess.unshift(action.payload);
            }
            else {
                const key = action.payload.to;
                setUnseenCount(key, state.unseenMessages[key] + 1);
                if (state.unseenMessages && key in state.unseenMessages) {
                    state.unseenMessages[key] += 1;
                }
            }
        },

        // set ids for chat
        setCurrFriendId(state, action: PayloadAction<string>) {
            state.currFriendId = action.payload;
        },
        setMainChatId(state, action: PayloadAction<string>) {

            state.mainChatId = action.payload;
        },
        setMainGroupId(state, action: PayloadAction<string>) {
            state.mainGroupId = action.payload;
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
            if (state.unseenMessages && key in state.unseenMessages && state.unseenMessages[key] !== 0) {
                setUnseenCount(key, 0);
                state.unseenMessages[key] = 0;
            }
        },
    },
});

export const { setPMessages, addPMessages, addLivePMessage,
    setGpMessages, addGpMessages, addLiveGpMessage,
    setCurrFriendId, setMainChatId, setMainGroupId,
    setUnseenMessages, addNewUnseen, resetUnseenMessage,
} = messagesSlice.actions;
export default messagesSlice.reducer;
