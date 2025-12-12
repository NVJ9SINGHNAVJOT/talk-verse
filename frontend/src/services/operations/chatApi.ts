import { chatEndPoints } from "@/services/apis";
import { fetchApi } from "@/services/fetchApi";
import {
  type ChatBarDataRs,
  type GetChatMessagesRs,
  type GetGroupMembersRs,
  type GetGroupMessagesRs,
} from "@/types/apis/chatApiRs";
import { type CommonRs } from "@/types/apis/common";

export const chatBarDataApi = async (): Promise<ChatBarDataRs | null> => {
  const resData: ChatBarDataRs = await fetchApi("GET", chatEndPoints.CHAT_BAR_DATA);
  if (resData) {
    return resData;
  }
  return null;
};

export const fileMessageApi = async (data: FormData): Promise<boolean> => {
  const resData: CommonRs = await fetchApi("POST", chatEndPoints.FILE_MESSAGE, data);
  if (resData && resData.success === true) {
    return true;
  }
  return false;
};

export const getMessagesApi = async (chatId: string, createdAt: string): Promise<GetChatMessagesRs | null> => {
  const resData: GetChatMessagesRs = await fetchApi("GET", chatEndPoints.CHAT_MESSAGES, null, null, {
    chatId: chatId,
    createdAt: createdAt,
  });
  if (resData) {
    return resData;
  }
  return null;
};

export const getGroupMessagesApi = async (groupId: string, createdAt: string): Promise<GetGroupMessagesRs | null> => {
  const resData: GetGroupMessagesRs = await fetchApi("GET", chatEndPoints.GROUP_MESSAGES, null, null, {
    groupId: groupId,
    createdAt: createdAt,
  });
  if (resData) {
    return resData;
  }
  return null;
};

export const getGroupMembersApi = async (groupId: string): Promise<GetGroupMembersRs | null> => {
  const resData: GetGroupMembersRs = await fetchApi("GET", chatEndPoints.GROUP_MEMBERS, null, null, {
    groupId: groupId,
  });
  if (resData) {
    return resData;
  }
  return null;
};
