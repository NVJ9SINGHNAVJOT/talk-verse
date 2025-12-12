import { type Profile } from "@/redux/slices/userSlice";
import { type UserSuggestion } from "@/types/apis/notificationApiRs";
import { type CommonRs } from "@/types/apis/common";

export type ProfileRs = CommonRs & {
  userData: Profile;
};

export type SetProfileImageRs = CommonRs & {
  imageUrl: string;
};

export type UserBlogProfileRs = CommonRs & {
  blogProfile: {
    followingCount: number;
    followersCount: number;
    totalPosts: number;
  };
};

export type UserFollowingRs = CommonRs & {
  following?: (UserSuggestion & { createdAt: string })[];
};

export type UserFollowersRs = CommonRs & {
  followers?: (UserSuggestion & { createdAt: string })[];
};
