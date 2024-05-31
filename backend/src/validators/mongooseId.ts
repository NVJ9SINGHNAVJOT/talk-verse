import mongoose from "mongoose";

export const isValidMongooseObjectId = (values: string[]) => {
    for (let index = 0; index < values.length; index++) {
        const checkId = values[index];
        if (!checkId || mongoose.Types.ObjectId.isValid(checkId) === false) {
            return false;
        }
    }
    return true;
};