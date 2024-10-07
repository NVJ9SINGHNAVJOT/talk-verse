import z, { number } from "zod";

export const OtherPostgreSQLUserIdReqSchema = z.object({
  otherUserId: number().min(1),
});

export const GetCreatedAtReqSchema = z.object({
  createdAt: z.string().datetime(),
});
