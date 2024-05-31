import { nameSchema } from "@/validators/zod";
import z from "zod";

export const FileMessageReqSchema = z.object({
    isGroup: z.enum(["true", "false"]),
    mainId: z.string(),
    to: z.string(),
    firstName: nameSchema.optional(),
    lastName: nameSchema.optional(),
    imageUrl: z.string().url().optional(),
}).refine((data) => {
    const { firstName, lastName } = data;
    return (firstName && lastName) || (!firstName && !lastName);
}, {
    message: "Either 'firstName' and 'lastName' should both be present or both be absent.",
});
export type FileMessageReq = z.infer<typeof FileMessageReqSchema>;