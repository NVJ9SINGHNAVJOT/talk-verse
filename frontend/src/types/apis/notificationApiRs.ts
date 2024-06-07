import { UserRequest } from "@/redux/slices/chatSlice";

export type GetUsersRs = {
  success: boolean;
  message: string;
  users: UserRequest[];
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
