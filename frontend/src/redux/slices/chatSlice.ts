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

export type UserRequest = {
    _id: string;
    userName: string;
    imageUrl?: string;
};

// Record<mainId, count>
export type UnseenMessages = Record<string, number>;

interface ChatState {
    friends: Friend[],
    groups: Group[],
    chatBarData: ChatBarData[],
    onlineFriends: string[],
    unseenMessages: UnseenMessages,
    userRequests: UserRequest[],
    userTyping: string[],
}

const initialState = {
    friends: [],
    groups: [],
    chatBarData: [],
    onlineFriends: [],
    unseenMessages: {},
    userRequests: [],
    userTyping: [],
} satisfies ChatState as ChatState;

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {

        // friends
        setFriends(state, action: PayloadAction<Friend[]>) {
            state.friends = action.payload;
        },
        addFriend(state, action: PayloadAction<Friend>) {
            state.friends.push(action.payload);
        },

        // groups
        setGroups(state, action: PayloadAction<Group[]>) {
            state.groups = action.payload;
        },
        addGroup(state, action: PayloadAction<Group>) {
            state.groups.push(action.payload);
        },

        // chatBarData
        setChatBarData(state, action: PayloadAction<ChatBarData[]>) {
            state.chatBarData = action.payload;
        },
        addChatBarData(state, action: PayloadAction<ChatBarData>) {
            state.chatBarData.unshift(action.payload);
        },
        setChatBarDataToFirst(state, action: PayloadAction<string>) {
            const dataIdToMove = action.payload;
            const dataIndex = state.chatBarData.findIndex(data => data._id === dataIdToMove);

            if (dataIndex !== undefined && dataIndex !== -1) {
                const data = state.friends.splice(dataIndex, 1);
                if (data !== undefined) {
                    state.friends?.unshift(data[0]);
                }
            }
        },

        // onlineFriends
        setOnlineFriend(state, action: PayloadAction<string[]>) {
            state.onlineFriends = action.payload;
        },
        addOnlineFriend(state, aciton: PayloadAction<string>) {
            state.onlineFriends = state.onlineFriends.filter((user) => user !== aciton.payload);
        },
        removeOnlineFriend(state, action: PayloadAction<string>) {
            state.onlineFriends.push(action.payload);
            if (state.userTyping.includes(action.payload)) {
                state.userTyping.filter((userId) => userId !== action.payload);
            }
        },

        // unseenMessages
        setUnseenMessages(state, action: PayloadAction<UnseenMessages>) {
            state.unseenMessages = action.payload;
        },
        addNewUnseen: (state, action: PayloadAction<string>) => {
            state.unseenMessages[action.payload] = 0;
        },
        updateUnseenMessages: (state, action: PayloadAction<string>) => {
            const key = action.payload;
            if (state.unseenMessages && key in state.unseenMessages) {
                state.unseenMessages[key] += 1;
            }
        },

        // userRequests
        setUserRequests(state, action: PayloadAction<UserRequest[]>) {
            state.userRequests = action.payload;
        },
        addUserRequest(state, action: PayloadAction<UserRequest>) {
            state.userRequests.push(action.payload);
        },
        deleteUserRequest(state, action: PayloadAction<string>) {
            state.userRequests = state.userRequests.filter((user) => user._id !== action.payload);
        },

        // userTyping
        addUserTyping(state, action: PayloadAction<string>) {
            state.userTyping.push(action.payload);
        },
        removeUserTyping(state, action: PayloadAction<string>) {
            state.userTyping = state.userTyping.filter((userId) => userId !== action.payload);
        }
    },
});

export const {
    setFriends, addFriend,
    setGroups, addGroup,
    setChatBarData, addChatBarData, setChatBarDataToFirst,
    setOnlineFriend, addOnlineFriend, removeOnlineFriend,
    setUnseenMessages, addNewUnseen, updateUnseenMessages,
    addUserRequest, setUserRequests, deleteUserRequest,
    addUserTyping, removeUserTyping
} = chatSlice.actions;

export default chatSlice.reducer;
