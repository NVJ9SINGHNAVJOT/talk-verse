import { mongooseIdSchema, nameSchema } from "@/validators/zod";
import z from "zod";

export const FileMessageReqSchema = z
  .object({
    isGroup: z.enum(["true", "false"]),
    mainId: mongooseIdSchema,
    to: mongooseIdSchema,
    firstName: nameSchema.optional(),
    lastName: nameSchema.optional(),
    imageUrl: z.string().url().optional(),
  })
  .refine(
    (data) => {
      const { firstName, lastName } = data;
      return (firstName && lastName) || (!firstName && !lastName);
    },
    {
      message: "Either 'firstName' and 'lastName' should both be present or both be absent.",
    }
  );
export type FileMessageReq = z.infer<typeof FileMessageReqSchema>;

export const ChatMessagesReqSchema = z.object({
  chatId: mongooseIdSchema,
  createdAt: z.string().datetime(),
});
export type ChatMessagesReq = z.infer<typeof ChatMessagesReqSchema>;

export const GroupMessagesReqSchema = z.object({
  groupId: mongooseIdSchema,
  createdAt: z.string().datetime(),
});
export type GroupMessagesReq = z.infer<typeof GroupMessagesReqSchema>;
