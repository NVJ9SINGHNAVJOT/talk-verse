import { z } from "zod";
import { emailSchema, nameSchema, optSchema, passwordSchema, fancyNameSchema } from "@/validators/zod";

export const SignUpReqSchema = z
  .object({
    firstName: nameSchema,
    lastName: nameSchema,
    userName: fancyNameSchema,
    email: emailSchema,
    otp: optSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine(
    (data) => {
      return data.password === data.confirmPassword;
    },
    {
      message: "password not matched with confirm password",
    }
  );
export type SignUpReq = z.infer<typeof SignUpReqSchema>;

export const LogInReqSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
export type LogInReq = z.infer<typeof LogInReqSchema>;

export const SendOtpReqSchema = z.object({
  email: emailSchema,
});
export type SendOtpReq = z.infer<typeof SendOtpReqSchema>;
