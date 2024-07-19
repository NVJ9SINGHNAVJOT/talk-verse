import { fancyNameSchema } from "@/validators/zod";
import z from "zod";

export const UpdateProfileReqSchema = z.object({
  userName: fancyNameSchema.optional(),
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  dateOfBirth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format. Expected YYYY-MM-DD.")
    .optional(),
  bio: z.string().min(1).max(150).optional(),
  countryCode: z
    .string()
    .regex(/^[a-zA-Z0-9+-]*$/)
    .optional(),
  contactNumber: z
    .string()
    .length(10)
    .regex(/^[1-9][0-9]{9}$/)
    .optional(),
});
export type UpdateProfileReq = z.infer<typeof UpdateProfileReqSchema>;

export const CheckUserNameReqSchema = z.object({
  userName: fancyNameSchema,
});
export type CheckUserNameReq = z.infer<typeof CheckUserNameReqSchema>;
