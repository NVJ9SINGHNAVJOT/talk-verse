import { Profile } from "@/redux/slices/userSlice";

export type GetProfileRs = {
  success: boolean;
  message: string;
  userData: Profile;
} | null;

export type SetProfileImageRs = {
  success: boolean;
  message: string;
  imageUrl: string;
} | null;

export type BlogProfile = {
  followingCount: number;
  followersCount: number;
  totalPosts: number;
};
export type UserBlogProfileRs = {
  success: boolean;
  message: string;
  blogProfile: BlogProfile;
} | null;
