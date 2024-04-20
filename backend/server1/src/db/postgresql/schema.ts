import * as user from "@/db/postgresql/schemas/user";
import * as post from "@/db/postgresql/schemas/post";
import * as comment from "@/db/postgresql/schemas/comment";

export const schema = { user, post, comment };