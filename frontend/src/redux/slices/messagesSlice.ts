import { setUnseenCount } from "@/services/operations/notificationApi";
import { SoMessageRecieved } from "@/types/socket/eventTypes";
import { errorMessage } from "@/utils/constants";
import { decryptGMessage, decryptPMessage } from "@/utils/encryptionAndDecryption";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type MessagesSliceObject = {
  currFriendId: string | undefined;
  mainChatId: string | undefined;
  mainGroupId: string | undefined;
  myId: string | undefined;
  myPrivateKey: string | undefined;
  publicKeys: Record<string, string>;
  chatIdStart: Record<string, boolean>;
  groupIdStart: Record<string, boolean>;
  chatIdEnd: Record<string, boolean>;
  groupIdEnd: Record<string, boolean>;
};
// NOTE: object below contains properties for reference only, not used for state rendering
export const messagesSliceObject: MessagesSliceObject = {
  currFriendId: undefined,
  mainChatId: undefined,
  mainGroupId: undefined,
  myId: undefined,
  myPrivateKey: undefined,
  publicKeys: {} as Record<string, string>,
  chatIdStart: {} as Record<string, boolean>,
  groupIdStart: {} as Record<string, boolean>,
  chatIdEnd: {} as Record<string, boolean>,
  groupIdEnd: {} as Record<string, boolean>,
};

export type GroupMessage = {
  uuId: string;
  isFile: boolean;
  from: {
    _id: string;
    firstName: string;
    lastName: string;
    imageUrl?: string;
  };
  to: string;
  text: string;
  createdAt: string;
};

type PMessages = Record<string, SoMessageRecieved[]>;
type GpMessages = Record<string, GroupMessage[]>;

interface messagesState {
  pMess: PMessages;
  gpMess: GpMessages;
  unseenMessages: Record<string, number>;
}

const initialState = {
  pMess: {},
  gpMess: {},
  unseenMessages: {},
} satisfies messagesState as messagesState;

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    // two users chat messages
    resetPMess(state) {
      state.pMess = {} as PMessages;
    },
    addPMessages(state, action: PayloadAction<SoMessageRecieved[]>) {
      if (!messagesSliceObject.myPrivateKey) {
        return;
      }
      for (let index = 0; index < action.payload.length; index++) {
        if (action.payload[index].isFile === false) {
          const newText = decryptPMessage(action.payload[index].text, messagesSliceObject.myPrivateKey);
          if (newText) {
            action.payload[index].text = newText;
          } else {
            action.payload[index].text = errorMessage;
          }
        }
      }
      if (state.pMess[action.payload[0].chatId] === undefined) {
        state.pMess[action.payload[0].chatId] = action.payload;
      } else {
        state.pMess[action.payload[0].chatId] = state.pMess[action.payload[0].chatId].concat(action.payload);
      }
    },
    addLivePMessage(state, action: PayloadAction<SoMessageRecieved>) {
      if (action.payload.isFile === false && messagesSliceObject.myPrivateKey) {
        const newText = decryptPMessage(action.payload.text, messagesSliceObject.myPrivateKey);
        if (newText) {
          action.payload.text = newText;
        } else {
          action.payload.text = errorMessage;
        }
      }

      // if no messages for chat then, this is first message
      if (state.pMess[action.payload.chatId] === undefined) {
        state.pMess[action.payload.chatId] = [action.payload];
      } else {
        state.pMess[action.payload.chatId].unshift(action.payload);
      }

      // update unseen count if current chat is not active on display
      if (
        action.payload.from !== messagesSliceObject.myId &&
        action.payload.chatId !== messagesSliceObject.mainChatId
      ) {
        const key = action.payload.chatId;
        if (key in state.unseenMessages) {
          state.unseenMessages[key] += 1;
          /*
            BUG: In multi tab opened below function will call
            api for updating unseen count.
            Depending upon which chat is open in talk page, value will be sent
            for updating.
          */
          setUnseenCount(key, state.unseenMessages[key] + 1);
        }
        /*
          TODO: if chat with friend is not present in unseenMessages,
          it means this current tab is not having chatBarData for friend,
          but friend exist.
          this also means that either user have opened multiple tabs and while new friend
          is added but not in this tab.
          FIXME: new friend to be added in multiple tabs
        */
      }
    },

    // group chat messages
    resetGpMess(state) {
      state.gpMess = {} as GpMessages;
    },
    addGpMessages(state, action: PayloadAction<GroupMessage[]>) {
      for (let index = 0; index < action.payload.length; index++) {
        if (action.payload[index].isFile === false) {
          const newText = decryptGMessage(action.payload[index].text);
          if (newText) {
            action.payload[index].text = newText;
          } else {
            action.payload[index].text = errorMessage;
          }
        }
      }

      if (state.gpMess[action.payload[0].to] === undefined) {
        state.gpMess[action.payload[0].to] = action.payload;
      } else {
        state.gpMess[action.payload[0].to] = state.gpMess[action.payload[0].to].concat(action.payload);
      }
    },
    addLiveGpMessage(state, action: PayloadAction<GroupMessage>) {
      if (action.payload.isFile === false) {
        const newText = decryptGMessage(action.payload.text);
        if (newText) {
          action.payload.text = newText;
        } else {
          action.payload.text = errorMessage;
        }
      }

      // if no messages for group then, this is first message
      if (state.gpMess[action.payload.to] === undefined) {
        state.gpMess[action.payload.to] = [action.payload];
      } else {
        state.gpMess[action.payload.to].unshift(action.payload);
      }

      // update unseen count if current group is not active on display
      if (
        action.payload.from._id !== messagesSliceObject.myId &&
        messagesSliceObject.mainGroupId !== action.payload.to
      ) {
        const key = action.payload.to;
        if (key in state.unseenMessages) {
          state.unseenMessages[key] += 1;
          /*
            BUG: In multi tab opened below function will call
            api for updating unseen count.
            Depending upon which chat is open in talk page, value will be sent
            for updating.
          */
          setUnseenCount(key, state.unseenMessages[key] + 1);
        }
        /*
          TODO: if group chat is not present in unseenMessages,
          it means this current tab is not having chatBarData for group,
          but group exist with current user as member of group.
          this also means that either user have opened multiple tabs and while new gorup
          is added but not in this tab.
          FIXME: new group to be added in multiple tabs
        */
      }
    },

    // unseenMessages
    setUnseenMessages(state, action: PayloadAction<Record<string, number>>) {
      state.unseenMessages = action.payload;
    },
    addNewUnseen: (state, action: PayloadAction<string>) => {
      state.unseenMessages[action.payload] = 0;
    },
    resetUnseenMessage(state, action: PayloadAction<string>) {
      const key = action.payload;
      if (key in state.unseenMessages && state.unseenMessages[key] !== 0) {
        state.unseenMessages[key] = 0;
        setUnseenCount(key, 0);
      }
    },
  },
});

export const {
  resetPMess,
  addPMessages,
  addLivePMessage,
  resetGpMess,
  addGpMessages,
  addLiveGpMessage,
  setUnseenMessages,
  addNewUnseen,
  resetUnseenMessage,
} = messagesSlice.actions;
export default messagesSlice.reducer;
