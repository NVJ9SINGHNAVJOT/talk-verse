import User from "@/db/mongodb/models/User";
import mongoose from "mongoose";

export const isValidMongooseObjectId = (values: string[], checkWithDatabase?: "yes" | "no"): boolean => {
  const checkUniqueValues = new Set(values);

  if (checkUniqueValues.size !== values.length) {
    return false;
  }

  for (let index = 0; index < values.length; index++) {
    const checkId = values[index];
    if (!checkId || mongoose.Types.ObjectId.isValid(checkId) === false) {
      return false;
    }
  }

  if (checkWithDatabase) {
    Promise.all(
      values.map(async (_id) => {
        const user = await User.findById({ _id }).select({ _id: true });
        return user !== null;
      })
    )
      .then((isValidIds) => {
        return isValidIds.every((result) => result === true);
      })
      .catch(() => {
        return false;
      });
  }

  return true;
};
