import { type UserRequest } from "@/redux/slices/chatSlice";
import { type CommonRs } from "@/types/apis/common";
import { type SoAddedInGroup } from "@/types/socket/eventTypes";

export type GetUsersRs = CommonRs & {
  users?: (UserRequest & { isAlreadyRequested: boolean })[];
};

export type FollowUsers = {
  id: number;
  userName: string;
  imageUrl?: string;
  isFollowed: boolean;
  isRequested: boolean;
};
export type GetFollowUsersRs = CommonRs & {
  followUsers?: FollowUsers[];
};

export type GetAllNotificationsRs = CommonRs & {
  userReqs?: UserRequest[];
  unseenMessages?: {
    mainId: string;
    count: number;
  }[];
};

export type CreateGroupRs = CommonRs & {
  newGroup: SoAddedInGroup;
};

export type AcceptRequestRs = CommonRs & {
  newFriend: {
    _id: string;
    firstName: string;
    lastName: string;
    imageUrl?: string;
  };
  newChatId: string;
  newFriendPublicKey: string;
};

export type CheckOnlineFriendsRs = CommonRs & {
  onlineFriends?: string[];
};

export type UserSuggestion = {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  imageUrl?: string;
};
export type FollowSuggestionsRs = CommonRs & {
  suggestions?: UserSuggestion[];
};

export type FollowRequestsRs = CommonRs & {
  followRequests?: UserSuggestion[];
};
