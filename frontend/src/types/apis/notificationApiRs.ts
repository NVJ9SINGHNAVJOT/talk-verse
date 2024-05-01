import { ReqUser } from "@/lib/inputs/chatsearchinput/ChatSearchInput";

export type GetUsersApi = {
    success: boolean,
    message: string,
    users: ReqUser[],
}