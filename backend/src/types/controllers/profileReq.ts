import { fancyNameSchema } from "@/validators/zod";
import z from "zod";

export const UpdateProfileReqSchema = z.object({
  userName: fancyNameSchema.optional(),
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  bio: z.string().min(1).max(150).optional(),
  countryCode: z
    .string()
    .regex(/^[a-zA-Z0-9+-]*$/)
    .optional(),
  contactNumber: z.string().min(1).max(9).regex(/^\d+$/).optional(),
});
export type UpdateProfileReq = z.infer<typeof UpdateProfileReqSchema>;

export const CheckUserNameReqSchema = z.object({
  userName: fancyNameSchema,
});
export type CheckUserNameReq = z.infer<typeof CheckUserNameReqSchema>;
