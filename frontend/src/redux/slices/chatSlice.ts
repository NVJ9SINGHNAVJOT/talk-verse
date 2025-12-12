import { setOrderApi } from "@/services/operations/notificationApi";
import { type SoAddedInGroup } from "@/types/socket/eventTypes";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type ChatSliceObject = {
  firstMainId: string;
};
// NOTE: object below contains properties for reference only, not used for state rendering
export const chatSliceObject: ChatSliceObject = {
  firstMainId: "",
};

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
}

const initialState = {
  friends: [],
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

    // chatBarData
    setChatBarData(state, action: PayloadAction<ChatBarData[]>) {
      state.chatBarData = action.payload;
      /*
        NOTE: this check for array length is done, because when talk page clean up is done,
        empty array is passed is reducer function
      */
      if (action.payload.length === 0) {
        return;
      }
      if ("chatId" in action.payload[0]) {
        chatSliceObject.firstMainId = action.payload[0].chatId;
      } else {
        chatSliceObject.firstMainId = action.payload[0]._id;
      }
    },
    addChatBarData(state, action: PayloadAction<ChatBarData>) {
      if ("chatId" in action.payload) {
        chatSliceObject.firstMainId = action.payload.chatId;
      } else {
        chatSliceObject.firstMainId = action.payload._id;
      }
      state.chatBarData.unshift(action.payload);
    },
    setChatBarDataToFirst(state, action: PayloadAction<string>) {
      chatSliceObject.firstMainId = action.payload;
      const dataIdToMove = action.payload;
      const dataIndex = state.chatBarData.findIndex(
        (data) => ("chatId" in data && data.chatId === dataIdToMove) || data._id === dataIdToMove
      );
      if (dataIndex !== -1) {
        const data = state.chatBarData.splice(dataIndex, 1);
        state.chatBarData.unshift(data[0]);
        setOrderApi(action.payload);
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
} = chatSlice.actions;

export default chatSlice.reducer;
