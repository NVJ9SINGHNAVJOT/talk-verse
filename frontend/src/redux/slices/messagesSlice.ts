import { setUnseenCount } from "@/services/operations/notificationApi";
import { SoMessageRecieved } from "@/types/socket/eventTypes";
import { decryptGMessage, decryptPMessage } from "@/utils/encryptionAndDecryption";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export const errorMessage = process.env.ERROR_MESSAGE as string;

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

// friends public key for encryption
export type PublicKeys = Record<string, string>;
export type PublicKey = {
    userId: string,
    publicKey: string
}

type PMessages = Record<string, SoMessageRecieved[]>
type GpMessages = Record<string, GroupMessages[]>

interface messagesState {
    pMess: PMessages,
    gpMess: GpMessages,
    currFriendId: string | undefined,
    mainChatId: string | undefined,
    mainGroupId: string | undefined,
    unseenMessages: UnseenMessages,
    myId: string | undefined,
    publicKeys: PublicKeys,
    myPrivateKey: string | undefined,
}

const initialState = {
    pMess: {},
    gpMess: {},
    currFriendId: undefined,
    mainChatId: undefined,
    mainGroupId: undefined,
    unseenMessages: {},
    myId: undefined,
    publicKeys: {},
    myPrivateKey: undefined,
} satisfies messagesState as messagesState;

const messagesSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        // two users chat messages
        addPMessages(state, action: PayloadAction<SoMessageRecieved[]>) {
            if (state.myPrivateKey !== undefined) {
                for (let index = 0; index < action.payload.length; index++) {
                    if (action.payload[index].isFile === false) {
                        const newText = decryptPMessage(action.payload[index].text, state.myPrivateKey);
                        if (newText) {
                            action.payload[index].text = newText;
                        }
                        else {
                            action.payload[index].text = errorMessage;
                        }
                    }
                }
                if (state.pMess[action.payload[0].chatId] === undefined) {
                    state.pMess[action.payload[0].chatId] = action.payload;
                }
                else {
                    state.pMess[action.payload[0].chatId] = state.pMess[action.payload[0].chatId].concat(action.payload);
                }
            }
        },
        addLivePMessage(state, action: PayloadAction<SoMessageRecieved>) {
            if (state.myPrivateKey && action.payload.isFile === false) {
                const newText = decryptPMessage(action.payload.text, state.myPrivateKey);
                if (newText) {
                    action.payload.text = newText;
                }
                else {
                    action.payload.text = errorMessage;
                }
            }

            // if no messages for chat then, this is first message
            if (state.pMess[action.payload.chatId] === undefined) {
                state.pMess[action.payload.chatId] = [action.payload];
            }
            else {
                state.pMess[action.payload.chatId].unshift(action.payload);
            }

            // update unseen count if current chat is not active on display
            if (state.mainChatId && action.payload.chatId !== state.mainChatId && action.payload.from !== state.myId) {
                const key = action.payload.chatId;
                setUnseenCount(key, state.unseenMessages[key] + 1);
                if (state.unseenMessages && key in state.unseenMessages) {
                    state.unseenMessages[key] += 1;
                }
            }
        },

        // group chat messages
        addGpMessages(state, action: PayloadAction<GroupMessages[]>) {
            for (let index = 0; index < action.payload.length; index++) {
                if (action.payload[index].isFile === false) {
                    const newText = decryptGMessage(action.payload[index].text);
                    if (newText) {
                        action.payload[index].text = newText;
                    }
                    else {
                        action.payload[index].text = errorMessage;
                    }
                }
            }

            if (state.gpMess[action.payload[0].to] === undefined) {
                state.gpMess[action.payload[0].to] = action.payload;
            }
            else {
                state.gpMess[action.payload[0].to] = state.gpMess[action.payload[0].to].concat(action.payload);
            }
        },
        addLiveGpMessage(state, action: PayloadAction<GroupMessages>) {
            if (action.payload.isFile === false) {
                const newText = decryptGMessage(action.payload.text);
                if (newText) {
                    action.payload.text = newText;
                }
                else {
                    action.payload.text = errorMessage;
                }
            }

            // if no messages for group then, this is first message
            if (state.gpMess[action.payload.to] === undefined) {
                state.gpMess[action.payload.to] = [action.payload];
            }
            else {
                state.gpMess[action.payload.to].unshift(action.payload);
            }

            // update unseen count if current group is not active on display
            if (action.payload.from._id !== state.myId) {
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
        setMyId(state, action: PayloadAction<string>) {
            state.myId = action.payload;
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

        // publilc keys
        setPublicKeys(state, action: PayloadAction<PublicKeys>) {
            state.publicKeys = action.payload;
        },
        addPublicKey(state, action: PayloadAction<PublicKey>) {
            state.publicKeys[action.payload.userId] = action.payload.publicKey;
        },
        setMyPrivateKey(state, action: PayloadAction<string>) {
            state.myPrivateKey = action.payload;
        },
    },
});

export const { addPMessages, addLivePMessage,
    addGpMessages, addLiveGpMessage,
    setCurrFriendId, setMainChatId, setMainGroupId, setMyId,
    setUnseenMessages, addNewUnseen, resetUnseenMessage,
    setPublicKeys, addPublicKey, setMyPrivateKey
} = messagesSlice.actions;
export default messagesSlice.reducer;
