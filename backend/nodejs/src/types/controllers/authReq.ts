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

export const LogInReqSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const SendOtpReqSchema = z.object({
  email: emailSchema,
  newUser: z.enum(["yes", "no"]),
});

export const ChangePasswordReqSchema = z
  .object({
    oldPassword: passwordSchema,
    newPassword: passwordSchema,
  })
  .refine(
    (data) => {
      return data.oldPassword !== data.newPassword;
    },
    {
      message: "current password same as new password",
    }
  );

export const VerifyOtpReqSchema = z.object({
  email: emailSchema,
  otp: optSchema,
});

export const ResetPasswordReqSchema = z
  .object({
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
