import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type Friend = {
    _id: string,
    firstName: string,
    lastName: string,
    imageUrl: string | null,
}

export type UnseenMessages = {
    _id: string,
    count: number,
}

interface ChatState {
    friends: Friend[] | null,
    onlineFriends: string[] | null
    unseenMessages: UnseenMessages[] | null
}

const initialState = {
    friends: null,
    onlineFriends: null,
    unseenMessages: null,
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
        setUserToFirst: (state, action: PayloadAction<string>) => {
            const userIdToMove = action.payload;
            const userIndex = state.friends?.findIndex(user => user._id === userIdToMove);

            if (userIndex !== undefined && userIndex !== -1) {
                const user = state.friends?.splice(userIndex, 1);
                if (user !== undefined) {
                    state.friends?.unshift(user[0]);
                }
            }
        },
    },
});

export const { setFriends } = chatSlice.actions;
export default chatSlice.reducer;
