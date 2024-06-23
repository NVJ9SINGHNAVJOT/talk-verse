import z, { number } from "zod";

export const OtherPostgreSQLUserIdReqSchema = z.object({
  otherUserId: number().min(1),
});
export type OtherPostgreSQLUserIdReq = z.infer<typeof OtherPostgreSQLUserIdReqSchema>;

export const GetCreatedAtReqSchema = z.object({
  createdAt: z.string().datetime(),
});
export type GetCreatedAtReq = z.infer<typeof GetCreatedAtReqSchema>;
