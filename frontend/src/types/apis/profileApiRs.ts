import { Profile } from "@/redux/slices/userSlice";
import { UserSuggestion } from "@/types/apis/notificationApiRs";

export type ProfileRs = {
  success: boolean;
  message: string;
  userData: Profile;
} | null;

export type SetProfileImageRs = {
  success: boolean;
  message: string;
  imageUrl: string;
} | null;

export type UserBlogProfileRs = {
  success: boolean;
  message: string;
  blogProfile: {
    followingCount: number;
    followersCount: number;
    totalPosts: number;
  };
} | null;

export type UserFollowingRs = {
  success: boolean;
  message: string;
  following?: UserSuggestion;
} | null;

export type UserFollowersRs = {
  success: boolean;
  message: string;
  followers?: UserSuggestion;
} | null;
