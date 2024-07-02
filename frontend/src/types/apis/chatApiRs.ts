import { ChatBarData, Friend } from "@/redux/slices/chatSlice";
import { GroupMessages } from "@/redux/slices/messagesSlice";
import { SoAddedInGroup, SoMessageRecieved } from "@/types/socket/eventTypes";
import { CommonRs } from "@/types/apis/common";

export type ChatBarDataRs = CommonRs & {
  friends?: Friend[];
  groups?: SoAddedInGroup[];
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
  messages?: GroupMessages[];
};

export type CreateGroupRs = CommonRs & {
  newGroup: SoAddedInGroup;
};
