import { fancyNameSchema, mongooseIdSchema, postgreSQLIdSchema } from "@/validators/zod";
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

export const OtherPostgreSQLUserIdReqSchema = z.object({
  otherUserId: postgreSQLIdSchema,
});
export type OtherPostgreSQLUserIdReq = z.infer<typeof OtherPostgreSQLUserIdReqSchema>;

export const UpdateFollowSuggestionReqSchema = z.object({
  previousSuggestionsIds: postgreSQLIdSchema.array().length(4).optional(),
});
export type UpdateFollowSuggestionReq = z.infer<typeof UpdateFollowSuggestionReqSchema>;
