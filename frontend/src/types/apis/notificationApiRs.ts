import { UserRequest } from "@/redux/slices/chatSlice";

export type GetUsersRs = {
  success: boolean;
  message: string;
  users?: (UserRequest & { isAlreadyRequested: boolean })[];
} | null;

export type FollowUsers = {
  id: number;
  userName: string;
  imageUrl?: string;
  isFollowed: boolean;
  isRequested: boolean;
};
export type GetFollowUsersRs = {
  success: boolean;
  message: string;
  followUsers?: FollowUsers[];
} | null;

export type GetAllNotificationsRs = {
  success: boolean;
  message: string;
  userReqs?: UserRequest[];
  unseenMessages?: {
    mainId: string;
    count: number;
  }[];
} | null;

export type AcceptRequestRs = {
  success: boolean;
  message: string;
  newFriend: {
    _id: string;
    firstName: string;
    lastName: string;
    imageUrl?: string;
  };
  newChatId: string;
  newFriendPublicKey: string;
} | null;

export type CheckOnlineFriendsRs = {
  success: boolean;
  message: string;
  onlineFriends?: string[];
} | null;

export type UserSuggestion = {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  imageUrl?: string;
};
export type FollowSuggestionsRs = {
  success: boolean;
  message: string;
  suggestions?: UserSuggestion[];
} | null;

export type FollowRequestsRs = {
  success: boolean;
  message: string;
  followRequests?: UserSuggestion[];
} | null;
