import { isValidMongooseObjectId } from "@/validators/mongooseId";
import { fancyNameSchema, mongooseIdSchema } from "@/validators/zod";
import z from "zod";

export const OtherMongoUserIdReqSchema = z.object({
  otherUserId: mongooseIdSchema,
});

export const SetUnseenCountReqSchema = z.object({
  mainId: mongooseIdSchema,
  count: z.number(),
});

export const CreateGroupReqSchema = z.object({
  groupName: fancyNameSchema,
  userIdsInGroup: z.string(), // JSON.stringify -> string[]
});

export const AddUsersInGroupReqSchema = z.object({
  groupId: mongooseIdSchema,
  userIdsToBeAdded: z
    .string()
    .array()
    .min(1)
    .refine(
      (value) => {
        return isValidMongooseObjectId(value, "yes");
      },
      { message: "invalid mongoose ids" }
    ),
});

export const SetOrderReqSchema = z.object({
  mainId: mongooseIdSchema,
});
