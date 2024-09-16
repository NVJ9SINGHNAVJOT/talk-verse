/* INFO: Any changes in socket events types need to be changed in frontend as well */

import { mongooseIdSchema, nameSchema } from "@/validators/zod";
import z from "zod";

// client
export type SoUserRequest = {
  _id: string;
  userName: string;
  imageUrl?: string;
};
export type SoRequestAccepted = {
  _id: string;
  chatId: string;
  firstName: string;
  lastName: string;
  imageUrl?: string;
  publicKey: string;
};
export type SoAddedInGroup = {
  _id: string;
  isAdmin: boolean;
  groupName: string;
  gpImageUrl?: string;
};
export type SoMessageRecieved = {
  uuId: string;
  isFile: boolean;
  chatId: string;
  from: string;
  text: string;
  createdAt: string;
};
export type SoGroupMessageRecieved = {
  uuId: string;
  isFile: boolean;
  from: string;
  to: string;
  text: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  imageUrl?: string;
};

// server
export const SoSendMessageSchema = z.object({
  chatId: mongooseIdSchema,
  to: mongooseIdSchema,
  fromText: z.string().min(1),
  toText: z.string().min(1),
});
export const SoSendGroupMessageSchema = z.object({
  _id: mongooseIdSchema,
  text: z.string().min(1),
  firstName: nameSchema,
  lastName: nameSchema,
  imageUrl: z
    .string()
    .refine((value) => value === "" || /^(https?:\/\/)[^\s$.?#].[^\s]*$/i.test(value), {
      message: "Invalid URL",
    })
    .optional(),
});
