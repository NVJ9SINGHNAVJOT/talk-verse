import User from "@/db/mongodb/models/User";
import { db } from "@/db/postgresql/connection";
import { post } from "@/db/postgresql/schema/post";
import { user } from "@/db/postgresql/schema/user";
import { CheckUserNameReqSchema, UpdateProfileReqSchema } from "@/types/controllers/profileReq";
import { CustomRequest } from "@/types/custom";
import { deleteFromCloudinay, uploadToCloudinary } from "@/utils/cloudinaryHandler";
import { deleteFile } from "@/utils/deleteFile";
import { errRes } from "@/utils/error";
import { count, eq } from "drizzle-orm";
import { Request, Response } from "express";

export const checkUserName = async (req: Request, res: Response): Promise<Response> => {
  try {
    const checkUserNameReq = CheckUserNameReqSchema.safeParse(req.query);
    if (!checkUserNameReq.success) {
      return errRes(res, 400, `invalid data for checkUserName, ${checkUserNameReq.error.toString()}`);
    }

    const data = checkUserNameReq.data;

    const checkUserName = await User.countDocuments({ userName: data.userName });

    if (checkUserName !== 0) {
      return res.status(200).json({
        success: false,
        message: "userName already exits",
      });
    }

    return res.status(200).json({
      success: true,
      message: "userName doesn't exits",
    });
  } catch (error) {
    return errRes(res, 500, "error while checking userName", error);
  }
};

export const getUserDetails = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = (req as CustomRequest).userId;

    const userData = await User.findById({ _id: userId })
      .select({
        email: true,
        userName: true,
        bio: true,
        gender: true,
        countryCode: true,
        contactNumber: true,
        about: true,
        updatedAt: true,
        _id: false,
      })
      .exec();

    if (!userData) {
      return errRes(res, 400, "user profile data not found");
    }

    return res.status(200).json({
      success: true,
      message: "user profile data",
      userData: userData,
    });
  } catch (error) {
    return errRes(res, 500, "error while getting user profile data", error);
  }
};

export const updateProfileImage = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = (req as CustomRequest).userId;
    const userId2 = (req as CustomRequest).userId2;

    if (!req.file) {
      return errRes(res, 400, "invalid data, imageFile not present");
    }

    const getUser = await User.findById({ _id: userId }).select({ imageUrl: true });

    if (!getUser) {
      if (req.file) {
        deleteFile(req.file);
      }
      return errRes(res, 400, "user not present for profile update");
    }

    const secUrl = await uploadToCloudinary(req.file);
    if (secUrl === null) {
      if (req.file) {
        deleteFile(req.file);
      }
      return errRes(res, 500, "error while uploading user profile image");
    }

    if (getUser.imageUrl) {
      const publicId = `${process.env["FOLDER_NAME"]}` + "/" + getUser.imageUrl.split("/").pop()?.split(".")[0];
      await deleteFromCloudinay(publicId);
    }

    getUser.imageUrl = secUrl;
    await getUser.save();
    await db.update(user).set({ imageUrl: secUrl }).where(eq(user.id, userId2)).execute();

    return res.status(200).json({
      success: true,
      message: "user profile image uploaded successfully",
      imageUrl: secUrl,
    });
  } catch (error) {
    if (req.file) {
      deleteFile(req.file);
    }
    return errRes(res, 500, "error while uploading user profile image", error);
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = (req as CustomRequest).userId;

    const updateProfileReq = UpdateProfileReqSchema.safeParse(req.body);
    if (!updateProfileReq.success) {
      return errRes(res, 400, `invalid data for pofile update, ${updateProfileReq.error.toString()}`);
    }
    const data = updateProfileReq.data;

    const user = await User.findById({ _id: userId })
      .select({
        email: true,
        userName: true,
        bio: true,
        gender: true,
        countryCode: true,
        contactNumber: true,
        about: true,
      })
      .exec();

    if (user) {
      if (data.bio) {
        user.bio = data.bio;
      }
      if (data.countryCode) {
        user.countryCode = data.countryCode;
      }
      if (data.contactNumber) {
        user.contactNumber = parseInt(data.contactNumber);
      }
      if (data.gender) {
        user.gender = data.gender;
      }
      // check whether userName exist or not
      if (data.userName) {
        const checkUsers = await User.countDocuments({ userName: data.userName });
        if (checkUsers === 0) {
          user.userName = data.userName;
          await user?.save();
          return res.status(200).json({
            success: true,
            message: "user details updated successfully",
            userData: user,
          });
        } else {
          await user.save();
          return res.status(200).json({
            success: false,
            message: "userName is already in use, try again",
          });
        }
      }

      // userName is not in data for update, so save user
      await user.save();
      return res.status(200).json({
        success: true,
        message: "user details updated successfully",
        userData: user,
      });
    }

    return res.status(400).json({
      success: false,
      message: "invalid data for user profile update",
    });
  } catch (error) {
    return errRes(res, 500, "error while updating user details", error);
  }
};

export const userBlogProfile = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId2 = (req as CustomRequest).userId2;

    const blogProfile = await db
      .select({ followingCount: user.followingCount, followersCount: user.followersCount })
      .from(user)
      .where(eq(user.id, userId2))
      .limit(1)
      .execute();

    const totalPosts = await db.select({ count: count() }).from(post).where(eq(post.userId, userId2));

    return res.status(200).json({
      success: true,
      message: "user blog profile data",
      blogProfile: {
        followingCount: blogProfile[0]?.followingCount,
        followersCount: blogProfile[0]?.followingCount,
        totalPosts: totalPosts[0]?.count,
      },
    });
  } catch (error) {
    return errRes(res, 500, "error while getting userBlogProfile data", error);
  }
};
