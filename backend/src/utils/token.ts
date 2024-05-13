import Token from "@/db/mongodb/models/Token";
import User from "@/db/mongodb/models/User";
import { CustomPayload } from "@/types/custom";
import jwt, { JwtPayload } from "jsonwebtoken";

export const jwtVerify = async (token: string): Promise<string | null> => {
    // check token exist in database or expired or invalid token
    const checkToken = await Token.find({ tokenValue: token }).exec();
    if (checkToken.length !== 1) {
        return null;
    }

    // decode token
    const decoded: CustomPayload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    if (!decoded.userId) {
        return null;
    }

    // check user again with decode token data (decoded data contain userid)
    const checkUser = await User.find({ _id: decoded.userId }).select({ userToken: true })
        .populate({ path: "userToken", select: "tokenValue" }).exec();

    if (checkUser.length !== 1 || checkUser[0]?.userToken?.tokenValue !== token) {
        return null;
    }

    return decoded.userId;
};