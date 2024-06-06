import { fancyNameSchema } from "@/validators/zod";
import z from "zod";

export const OtherUserIdReqSchema = z.object({
  otherUserId: z.string(),
});
export type OtherUserIdReq = z.infer<typeof OtherUserIdReqSchema>;

export const SetUnseenCountReqSchema = z.object({
  mainId: z.string(),
  count: z.number(),
});
export type SetUnseenCountReq = z.infer<typeof SetUnseenCountReqSchema>;

export const CreateGroupReqSchema = z.object({
  groupName: fancyNameSchema,
  userIdsInGroup: z.string(), // JSON.stringify -> string[]
});
export type CreateGroupReq = z.infer<typeof CreateGroupReqSchema>;

export const SetOrderReqSchema = z.object({
  mainId: z.string(),
});
export type SetOrderReq = z.infer<typeof SetOrderReqSchema>;
