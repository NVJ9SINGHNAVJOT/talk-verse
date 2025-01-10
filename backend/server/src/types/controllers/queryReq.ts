import { emailSchema } from "@/validators/zod";
import z from "zod";

export const SendQueryReqSchema = z.object({
  fullName: z
    .string()
    .min(2)
    .max(30)
    .regex(/^[a-zA-Z\s]{2,}$/)
    .refine((value) => value === value.trim(), {
      message: "String contains leading or trailing whitespaces",
    }),
  email: emailSchema,
  text: z.array(z.string()).refine(
    (arr) => {
      const combinedLength = arr.reduce((total, str) => total + str.length, 0);
      return combinedLength <= 450;
    },
    { message: "total combined length of text array must not exceed 450 characters" }
  ),
});
