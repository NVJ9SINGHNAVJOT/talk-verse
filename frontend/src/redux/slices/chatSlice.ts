import { setOrderApi } from "@/services/operations/notificationApi";
import { SoAddedInGroup } from "@/types/socket/eventTypes";
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

export type UserRequest = {
    _id: string;
    userName: string;
    imageUrl?: string;
};

interface ChatState {
    friends: Friend[],
    groups: SoAddedInGroup[],
    chatBarData: ChatBarData[],
    onlineFriends: string[],
    userRequests: UserRequest[],
    userTyping: string[],
    lastMainId: string | undefined
}

const initialState = {
    friends: [],
    groups: [],
    chatBarData: [],
    onlineFriends: [],
    userRequests: [],
    userTyping: [],
    lastMainId: undefined
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
        setGroups(state, action: PayloadAction<SoAddedInGroup[]>) {
            state.groups = action.payload;
        },
        addGroup(state, action: PayloadAction<SoAddedInGroup>) {
            state.groups.push(action.payload);
        },

        // chatBarData
        setChatBarData(state, action: PayloadAction<ChatBarData[]>) {
            state.chatBarData = action.payload;
        },
        addChatBarData(state, action: PayloadAction<ChatBarData>) {
            const { chatId } = action.payload;
            if (chatId) {
                state.lastMainId = chatId;
            }
            else {
                state.lastMainId = action.payload._id;
            }
            state.chatBarData.unshift(action.payload);
        },
        setFriendToFirst(state, action: PayloadAction<string>) {
            setOrderApi(action.payload);
            state.lastMainId = action.payload;
            const dataIdToMove = action.payload;
            const dataIndex = state.chatBarData.findIndex(data => data.chatId === dataIdToMove);
            if (dataIndex !== undefined && dataIndex !== -1) {
                const data = state.chatBarData.splice(dataIndex, 1);
                if (data !== undefined) {
                    state.chatBarData.unshift(data[0]);
                }
            }
        },
        setGroupToFirst(state, action: PayloadAction<string>) {
            setOrderApi(action.payload);
            state.lastMainId = action.payload;
            const dataIdToMove = action.payload;
            const dataIndex = state.chatBarData.findIndex(data => data._id === dataIdToMove);
            if (dataIndex !== undefined && dataIndex !== -1) {
                const data = state.chatBarData.splice(dataIndex, 1);
                if (data !== undefined) {
                    state.chatBarData.unshift(data[0]);
                }
            }
        },

        // onlineFriends
        setOnlineFriend(state, action: PayloadAction<string[]>) {
            state.onlineFriends = action.payload;
        },
        addOnlineFriend(state, action: PayloadAction<string>) {
            state.onlineFriends.push(action.payload);
        },
        removeOnlineFriend(state, action: PayloadAction<string>) {
            state.onlineFriends = state.onlineFriends.filter((friendId) => friendId !== action.payload);
            if (state.userTyping.includes(action.payload)) {
                state.userTyping = state.userTyping.filter((friendId) => friendId !== action.payload);
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
        },

        // set lastMainId
        setLastMainId(state, action: PayloadAction<string>) {
            state.lastMainId = action.payload;
        }
    },
});

export const {
    setFriends, addFriend,
    setGroups, addGroup,
    setChatBarData, addChatBarData, setFriendToFirst, setGroupToFirst,
    setOnlineFriend, addOnlineFriend, removeOnlineFriend,
    addUserRequest, setUserRequests, deleteUserRequest,
    resetTyping, addUserTyping, removeUserTyping,
    setLastMainId
} = chatSlice.actions;

export default chatSlice.reducer;
