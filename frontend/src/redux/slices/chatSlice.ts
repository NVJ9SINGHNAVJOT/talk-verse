import { setOrderApi } from "@/services/operations/notificationApi";
import { SoAddedInGroup } from "@/types/socket/eventTypes";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type ChatBarData = Friend | SoAddedInGroup;

export type Friend = {
  _id: string;
  chatId: string;
  firstName: string;
  lastName: string;
  imageUrl?: string;
};

export type UserRequest = {
  _id: string;
  userName: string;
  imageUrl?: string;
};

interface ChatState {
  friends: Friend[];
  chatBarData: ChatBarData[];
  onlineFriends: string[];
  userRequests: UserRequest[];
  userTyping: string[];
  firstMainId: string | undefined;
}

const initialState = {
  friends: [],
  chatBarData: [],
  onlineFriends: [],
  userRequests: [],
  userTyping: [],
  firstMainId: undefined,
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

    // chatBarData
    setChatBarData(state, action: PayloadAction<ChatBarData[]>) {
      state.chatBarData = action.payload;
    },
    addChatBarData(state, action: PayloadAction<ChatBarData>) {
      if ("chatId" in action.payload) {
        state.firstMainId = action.payload.chatId;
      } else {
        state.firstMainId = action.payload._id;
      }
      state.chatBarData.unshift(action.payload);
    },
    setChatBarDataToFirst(state, action: PayloadAction<string>) {
      if (
        state.chatBarData[0]._id === action.payload ||
        ("chatId" in state.chatBarData[0] && state.chatBarData[0].chatId === action.payload)
      ) {
        return;
      }
      setOrderApi(action.payload);
      state.firstMainId = action.payload;
      const dataIdToMove = action.payload;
      const dataIndex = state.chatBarData.findIndex(
        (data) => ("chatId" in data && data.chatId === dataIdToMove) || data._id === dataIdToMove
      );
      if (dataIndex !== -1) {
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
      if (!state.onlineFriends.includes(action.payload)) {
        state.onlineFriends.push(action.payload);
      }
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
      if (!state.userTyping.includes(action.payload)) {
        state.userTyping.push(action.payload);
      }
    },
    removeUserTyping(state, action: PayloadAction<string>) {
      state.userTyping = state.userTyping.filter((userId) => userId !== action.payload);
    },

    // set firstMainId
    setLastMainId(state, action: PayloadAction<string | undefined>) {
      state.firstMainId = action.payload;
    },
  },
});

export const {
  setFriends,
  addFriend,
  setChatBarData,
  addChatBarData,
  setChatBarDataToFirst,
  setOnlineFriend,
  addOnlineFriend,
  removeOnlineFriend,
  addUserRequest,
  setUserRequests,
  deleteUserRequest,
  resetTyping,
  addUserTyping,
  removeUserTyping,
  setLastMainId,
} = chatSlice.actions;

export default chatSlice.reducer;
