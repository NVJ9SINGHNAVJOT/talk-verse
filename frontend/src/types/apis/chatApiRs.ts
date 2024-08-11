import { ChatBarData, Friend } from "@/redux/slices/chatSlice";
import { GroupMessage } from "@/redux/slices/messagesSlice";
import { SoMessageRecieved } from "@/types/socket/eventTypes";
import { CommonRs } from "@/types/apis/common";

export type ChatBarDataRs = CommonRs & {
  friends?: Friend[];
  chatBarData?: ChatBarData[];
  friendPublicKeys?: {
    friendId: string;
    publicKey: string;
  }[];
};

export type GetChatMessagesRs = CommonRs & {
  messages?: SoMessageRecieved[];
};

export type GetGroupMessagesRs = CommonRs & {
  messages?: GroupMessage[];
};

export type GetGroupMembersRs = CommonRs & {
  members: string[];
};
