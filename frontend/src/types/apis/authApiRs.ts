import { User } from "@/redux/slices/userSlice";

export type CheckUserRs = {
    success: boolean,
    message: string,
    user: User
} | null