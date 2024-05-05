import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type ChatBarData = {
    // common
    _id: string,

    // friend
    chatId?: string
    firstName?: string,
    lastName?: string,
    imageUrl?: string

    // group
    groupName?: string,
    gpImageUrl?: string
}

export type Friend = {
    _id: string,
    chatId: string
    firstName: string,
    lastName: string,
    imageUrl?: string
}

export type Group = {
    _id: string,
    groupName: string,
    gpImageUrl?: string
}

export type UnseenMessages = Record<string, number>;

interface ChatState {
    friends: Friend[] | null,
    groups: Group[] | null,
    chatBarData: ChatBarData[] | null,
    onlineFriends: string[] | null,
    unseenMessages: UnseenMessages | null,
    userTyping: string[] | null
}

const initialState = {
    friends: null,
    groups: null,
    chatBarData: null,
    onlineFriends: null,
    unseenMessages: null,
    userTyping: null
} satisfies ChatState as ChatState;

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setFriends(state, action: PayloadAction<Friend[]>) {
            state.friends = action.payload;
        },
        addFriend(state, action: PayloadAction<Friend>) {
            state.friends?.push(action.payload);
        },
        setFriendOnline(state, action: PayloadAction<string>) {
            state.onlineFriends?.push(action.payload);
        },
        setFriendOffline(state, action: PayloadAction<string>) {
            state.onlineFriends?.filter((userId) => userId !== (action.payload));
        },
        setUserToFirst(state, action: PayloadAction<string>) {
            const userIdToMove = action.payload;
            const userIndex = state.friends?.findIndex(user => user._id === userIdToMove);

            if (userIndex !== undefined && userIndex !== -1) {
                const user = state.friends?.splice(userIndex, 1);
                if (user !== undefined) {
                    state.friends?.unshift(user[0]);
                }
            }
        },
        setUnseenMessages(state, action: PayloadAction<UnseenMessages>) {
            state.unseenMessages = action.payload;
        },
        addNewUnseen: (state, action: PayloadAction<{ key: string; value: number }>) => {
            const { key, value } = action.payload;
            if (state.unseenMessages) {
                state.unseenMessages[key] = value;
            }
        },
        updateUnseenMessages: (state, action: PayloadAction<{ key: string; newValue: number }>) => {
            const { key, newValue } = action.payload;
            if (state.unseenMessages && key in state.unseenMessages) {
                state.unseenMessages[key] = newValue;
            }
        },
    },
});

export const { setFriends } = chatSlice.actions;
export default chatSlice.reducer;
