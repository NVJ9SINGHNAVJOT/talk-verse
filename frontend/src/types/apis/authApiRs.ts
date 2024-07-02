import { User } from "@/redux/slices/userSlice";
import { CommonRs } from "@/types/apis/common";

export type CheckUserRs = CommonRs & {
  user: User;
};
