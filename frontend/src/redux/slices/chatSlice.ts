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

interface ChatState {
    friends: Friend[],
    groups: Group[],
    chatBarData: ChatBarData[],
    onlineFriends: string[],
    userRequests: UserRequest[],
    userTyping: string[],
}

const initialState = {
    friends: [],
    groups: [],
    chatBarData: [],
    onlineFriends: [],
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
            state.userRequests = state.userRequests.filter((userR) => userR._id !== action.payload._id);
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
                const data = state.chatBarData.splice(dataIndex, 1);
                if (data !== undefined) {
                    state.chatBarData?.unshift(data[0]);
                }
            }
        },

        // onlineFriends
        setOnlineFriend(state, action: PayloadAction<string[]>) {
            state.onlineFriends = action.payload;
        },
        addOnlineFriend(state, aciton: PayloadAction<string>) {
            state.onlineFriends.push(aciton.payload);
        },
        removeOnlineFriend(state, action: PayloadAction<string>) {
            state.onlineFriends = state.onlineFriends.filter((userId) => userId !== action.payload);
            if (state.userTyping.includes(action.payload)) {
                state.userTyping = state.userTyping.filter((userId) => userId !== action.payload);
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
        resetTyping(state) {
            state.userTyping = [];
        },
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
    addUserRequest, setUserRequests, deleteUserRequest,
    resetTyping, addUserTyping, removeUserTyping
} = chatSlice.actions;

export default chatSlice.reducer;
