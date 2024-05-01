import { ReqUser } from "@/lib/inputs/chatsearchinput/ChatSearchInput";

export type UsersRs = {
    success: boolean,
    message: string,
    users: ReqUser[],
}