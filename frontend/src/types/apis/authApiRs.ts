import { type User } from "@/redux/slices/userSlice";
import { type CommonRs } from "@/types/apis/common";

export type CheckUserRs = CommonRs & {
  user?: User;
};
