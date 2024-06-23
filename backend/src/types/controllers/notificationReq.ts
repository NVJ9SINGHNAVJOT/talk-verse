import { fancyNameSchema, mongooseIdSchema } from "@/validators/zod";
import z from "zod";

export const OtherMongoUserIdReqSchema = z.object({
  otherUserId: mongooseIdSchema,
});
export type OtherMongoUserIdReq = z.infer<typeof OtherMongoUserIdReqSchema>;

export const SetUnseenCountReqSchema = z.object({
  mainId: mongooseIdSchema,
  count: z.number(),
});
export type SetUnseenCountReq = z.infer<typeof SetUnseenCountReqSchema>;

export const CreateGroupReqSchema = z.object({
  groupName: fancyNameSchema,
  userIdsInGroup: z.string(), // JSON.stringify -> string[]
});
export type CreateGroupReq = z.infer<typeof CreateGroupReqSchema>;

export const SetOrderReqSchema = z.object({
  mainId: mongooseIdSchema,
});
export type SetOrderReq = z.infer<typeof SetOrderReqSchema>;
