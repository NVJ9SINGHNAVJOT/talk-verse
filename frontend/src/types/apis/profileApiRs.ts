import { Profile } from "@/redux/slices/userSlice";

export type GetProfileRs = {
    success: boolean,
    message: string,
    userData: Profile
}

export type SetProfileImageRs = {
    success: boolean,
    message: string,
    imageUrl: string,
}