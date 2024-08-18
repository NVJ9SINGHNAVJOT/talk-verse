import User from "@/db/mongodb/models/User";
import { db } from "@/db/postgresql/connection";
import { follow } from "@/db/postgresql/schema/follow";
import { likes } from "@/db/postgresql/schema/likes";
import { post } from "@/db/postgresql/schema/post";
import { save } from "@/db/postgresql/schema/save";
import { user } from "@/db/postgresql/schema/user";
import { GetCreatedAtReqSchema, OtherPostgreSQLUserIdReqSchema } from "@/types/controllers/common";
import { CheckUserNameReqSchema, UpdateProfileReqSchema } from "@/types/controllers/profileReq";
import { CustomRequest } from "@/types/custom";
import { deleteFromCloudinay, uploadToCloudinary } from "@/utils/cloudinaryHandler";
import { deleteFile } from "@/utils/deleteFile";
import { errRes } from "@/utils/error";
import { count, desc, eq, sql, and, lt } from "drizzle-orm";
import { Request, Response } from "express";

export const checkUserName = async (req: Request, res: Response): Promise<Response> => {
  try {
    const checkUserNameReq = CheckUserNameReqSchema.safeParse(req.query);
    if (!checkUserNameReq.success) {
      return errRes(res, 400, `invalid data for checkUserName, ${checkUserNameReq.error.message}`);
    }

    const data = checkUserNameReq.data;

    const checkUserName = await User.findOne({ userName: data.userName }).select({ userName: true }).exec();

    if (checkUserName) {
      return res.status(200).json({
        success: false,
        message: "userName already exits",
      });
    }

    return res.status(200).json({
      success: true,
      message: "userName doesn't exits",
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return errRes(res, 500, "error while checking userName", error.message);
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
        dateOfBirth: true,
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return errRes(res, 500, "error while getting user profile data", error.message);
  }
};

export const updateProfileImage = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.file) {
      return errRes(res, 400, "invalid data, imageFile not present");
    }

    const userId = (req as CustomRequest).userId;
    const userId2 = (req as CustomRequest).userId2;

    const getUser = await User.findById({ _id: userId }).select({ imageUrl: true });

    if (!getUser) {
      if (req.file) {
        deleteFile(req.file);
      }
      return errRes(res, 400, "user not present for profile update");
    }

    const secUrl = await uploadToCloudinary(req.file);
    if (secUrl === null) {
      return errRes(res, 500, "error while uploading user profile image");
    }

    if (getUser.imageUrl) {
      deleteFromCloudinay(getUser.imageUrl);
    }

    getUser.imageUrl = secUrl;
    await getUser.save();
    await db.update(user).set({ imageUrl: secUrl }).where(eq(user.id, userId2)).execute();

    return res.status(200).json({
      success: true,
      message: "user profile image uploaded successfully",
      imageUrl: secUrl,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (req.file) {
      deleteFile(req.file);
    }
    return errRes(res, 500, "error while uploading user profile image", error.message);
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = (req as CustomRequest).userId;

    const updateProfileReq = UpdateProfileReqSchema.safeParse(req.body);
    if (!updateProfileReq.success) {
      return errRes(res, 400, `invalid data for pofile update, ${updateProfileReq.error.message}`);
    }
    const data = updateProfileReq.data;

    const mongoUser = await User.findById({ _id: userId })
      .select({
        email: true,
        userName: true,
        bio: true,
        dateOfBirth: true,
        gender: true,
        countryCode: true,
        contactNumber: true,
        about: true,
      })
      .exec();

    if (!mongoUser) {
      return errRes(res, 400, "invalid user");
    }
    // check userName
    if (data.userName) {
      const checkUsers = await User.countDocuments({ userName: data.userName });
      if (checkUsers !== 0) {
        return errRes(res, 400, "userName is already in use");
      }
      mongoUser.userName = data.userName;
    }
    if (data.bio) {
      mongoUser.bio = data.bio;
    }
    if (data.countryCode) {
      mongoUser.countryCode = data.countryCode;
    }
    if (data.contactNumber) {
      if (!data.countryCode && !mongoUser.countryCode) {
        return errRes(res, 400, "country code is required for contact number");
      }
      mongoUser.contactNumber = parseInt(data.contactNumber);
    }
    if (data.gender) {
      mongoUser.gender = data.gender;
    }
    if (data.dateOfBirth) {
      mongoUser.dateOfBirth = data.dateOfBirth;
    }

    // now save updated data
    if (data.userName) {
      await db.update(user).set({ userName: data.userName }).where(eq(user.refId, userId)).execute();
    }
    await mongoUser.save();

    return res.status(200).json({
      success: true,
      message: "user details updated successfully",
      userData: mongoUser,
    });

    return res.status(400).json({
      success: false,
      message: "invalid data for user profile update",
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return errRes(res, 500, "error while updating user details", error.message);
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

    const totalPosts = await db
      .select({ count: count() })
      .from(post)
      .where(and(eq(post.userId, userId2), eq(post.isPostDeleted, false)));

    return res.status(200).json({
      success: true,
      message: "user blog profile data",
      blogProfile: {
        followingCount: blogProfile[0]?.followingCount,
        followersCount: blogProfile[0]?.followersCount,
        totalPosts: totalPosts[0]?.count,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return errRes(res, 500, "error while getting userBlogProfile data", error.message);
  }
};

export const userPosts = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId2 = (req as CustomRequest).userId2;

    const userPostsReq = GetCreatedAtReqSchema.safeParse(req.query);
    if (!userPostsReq.success) {
      return errRes(res, 400, `invalid data for userPosts, ${userPostsReq.error.message}`);
    }

    const data = userPostsReq.data;

    const currUserPosts = await db
      .select({
        id: post.id,
        isCurrentUser: sql<boolean>`CASE WHEN ${post.userId} = ${userId2} THEN TRUE ELSE FALSE END`,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        userName: user.userName,
        isSaved: sql<boolean>`CASE WHEN ${save.userId} = ${userId2} AND ${save.postId} = ${post.id} THEN TRUE ELSE FALSE END`,
        isLiked: sql<boolean>`CASE WHEN ${likes.userId} = ${userId2} AND ${likes.postId} = ${post.id} THEN TRUE ELSE FALSE END`,
        commentsCount: post.commentsCount,
        category: post.category,
        title: post.title,
        mediaUrls: post.mediaUrls,
        tags: post.tags,
        content: post.content,
        likesCount: post.likesCount,
        createdAt: post.createdAt,
      })
      .from(post)
      .innerJoin(user, and(eq(post.userId, user.id), eq(user.id, userId2)))
      .leftJoin(save, and(eq(save.postId, post.id), eq(save.userId, userId2)))
      .leftJoin(likes, and(eq(likes.userId, userId2), eq(likes.postId, post.id)))
      .where(and(eq(post.userId, userId2), lt(post.createdAt, new Date(data.createdAt)), eq(post.isPostDeleted, false)))
      .orderBy(desc(post.createdAt))
      .limit(15)
      .execute();

    if (currUserPosts.length) {
      return res.status(200).json({
        success: true,
        message: "user posts",
        posts: currUserPosts,
      });
    }
    return res.status(200).json({
      success: false,
      message: "no further user posts",
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return errRes(res, 500, "error while getting user posts");
  }
};

export const userFollowing = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId2 = (req as CustomRequest).userId2;

    const userFollowingReq = GetCreatedAtReqSchema.safeParse(req.query);
    if (!userFollowingReq.success) {
      return errRes(res, 400, `invalid data for user following, ${userFollowingReq.error.message}`);
    }

    const data = userFollowingReq.data;

    const following = await db
      .select({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        userName: user.userName,
        createdAt: follow.createdAt,
      })
      .from(follow)
      .innerJoin(user, eq(follow.followingId, user.id))
      .where(and(eq(follow.followerId, userId2), lt(follow.createdAt, new Date(data.createdAt))))
      .limit(20)
      .orderBy(desc(follow.createdAt))
      .execute();

    if (following.length) {
      return res.status(200).json({
        success: true,
        message: "user following",
        following: following,
      });
    }

    return res.status(200).json({
      success: false,
      message: "no further user following",
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return errRes(res, 500, "error while getting user following");
  }
};

export const userFollowers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId2 = (req as CustomRequest).userId2;

    const userFollowersReq = GetCreatedAtReqSchema.safeParse(req.query);
    if (!userFollowersReq.success) {
      return errRes(res, 400, `invalid data for user followers, ${userFollowersReq.error.message}`);
    }

    const data = userFollowersReq.data;

    const followers = await db
      .select({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        userName: user.userName,
        createdAt: follow.createdAt,
      })
      .from(follow)
      .innerJoin(user, eq(follow.followerId, user.id))
      .where(and(eq(follow.followingId, userId2), lt(follow.createdAt, new Date(data.createdAt))))
      .limit(20)
      .orderBy(desc(follow.createdAt))
      .execute();

    if (followers.length) {
      return res.status(200).json({
        success: true,
        message: "user followers",
        followers: followers,
      });
    }

    return res.status(200).json({
      success: false,
      message: "no further user followers",
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return errRes(res, 500, "error while getting user followers");
  }
};

export const removeFollower = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId2 = (req as CustomRequest).userId2;

    const removeFollwerReq = OtherPostgreSQLUserIdReqSchema.safeParse(req.body);
    if (!removeFollwerReq.success) {
      return errRes(res, 400, `invalid data to remove follower, ${removeFollwerReq.error.message}`);
    }

    const data = removeFollwerReq.data;

    const checkRemoveFollwer = await db
      .delete(follow)
      .where(and(eq(follow.followingId, userId2), eq(follow.followerId, data.otherUserId)))
      .returning({ id: follow.id })
      .execute();

    if (checkRemoveFollwer.length !== 0) {
      // decrease current user followersCount by 1
      await db
        .update(user)
        .set({ followersCount: sql`${user.followersCount} - 1` })
        .where(eq(user.id, userId2));

      // decrease otherUserId user followingCount by 1
      await db
        .update(user)
        .set({ followingCount: sql`${user.followingCount} - 1` })
        .where(eq(user.id, data.otherUserId));

      return res.status(200).json({
        success: true,
        message: "user removed from followers",
      });
    }

    /*
      TODO: {status: 200, success: true} can be return if now follower exists with otherUserId for current user.
      it is possible that before current request for removing follower, otherUserId user
      already unfollowed current user(removed current user from it's following users).
    */
    return errRes(res, 400, "invalid follower id, no follower exists for other userId");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return errRes(res, 500, "error while removing follower", error.message);
  }
};

export const unfollowUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId2 = (req as CustomRequest).userId2;

    const unfollowUserReq = OtherPostgreSQLUserIdReqSchema.safeParse(req.body);
    if (!unfollowUserReq.success) {
      return errRes(res, 400, `invalid data to unfollow user, ${unfollowUserReq.error.message}`);
    }

    const data = unfollowUserReq.data;

    const checkUnfollowUser = await db
      .delete(follow)
      .where(and(eq(follow.followingId, data.otherUserId), eq(follow.followerId, userId2)))
      .returning({ id: follow.id })
      .execute();

    if (checkUnfollowUser.length !== 0) {
      // decrease current user followingCount by 1
      await db
        .update(user)
        .set({ followersCount: sql`${user.followingCount} - 1` })
        .where(eq(user.id, userId2));

      // decrease otherUserId user followersCount by 1
      await db
        .update(user)
        .set({ followingCount: sql`${user.followersCount} - 1` })
        .where(eq(user.id, data.otherUserId));

      return res.status(200).json({
        success: true,
        message: "other user unfollowed",
      });
    }

    /*
      TODO: {status: 200, success: true} can be return if otherUserId user does not exists in 
      current user following users in database.
      it is possible that before current request for unfollowing otherUserId user, otherUserId user
      already removed current user from it's followers(removed current user as follower).
    */
    return errRes(res, 400, "invalid following id, no following exists for other userId");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return errRes(res, 500, "error while removing following other user", error.message);
  }
};

export const userSavedPosts = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId2 = (req as CustomRequest).userId2;

    const userSavedPostsReq = GetCreatedAtReqSchema.safeParse(req.query);
    if (!userSavedPostsReq.success) {
      return errRes(res, 400, `invalid data for user saved posts, ${userSavedPostsReq.error.message}`);
    }

    const data = userSavedPostsReq.data;

    const userSavedPosts = await db
      .select({
        id: post.id,
        isCurrentUser: sql<boolean>`CASE WHEN ${post.userId} = ${userId2} THEN TRUE ELSE FALSE END`,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        userName: user.userName,
        isSaved: sql<boolean>`CASE WHEN ${save.userId} = ${userId2} AND ${save.postId} = ${post.id} THEN TRUE ELSE FALSE END`,
        isLiked: sql<boolean>`CASE WHEN ${likes.userId} = ${userId2} AND ${likes.postId} = ${post.id} THEN TRUE ELSE FALSE END`,
        commentsCount: post.commentsCount,
        category: post.category,
        title: post.title,
        mediaUrls: post.mediaUrls,
        tags: post.tags,
        content: post.content,
        likesCount: post.likesCount,
        createdAt: post.createdAt,
      })
      .from(save)
      .innerJoin(post, and(eq(post.id, save.postId), eq(save.userId, userId2)))
      .innerJoin(user, eq(post.userId, user.id))
      .leftJoin(likes, and(eq(likes.userId, userId2), eq(likes.postId, post.id)))
      .where(and(eq(save.userId, userId2), lt(post.createdAt, new Date(data.createdAt)), eq(post.isPostDeleted, false)))
      .orderBy(desc(save.createdAt))
      .limit(15)
      .execute();

    if (userSavedPosts.length) {
      return res.status(200).json({
        success: true,
        message: "user saved posts",
        posts: userSavedPosts,
      });
    }
    return res.status(200).json({
      success: false,
      message: "no further user saved posts",
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return errRes(res, 500, "error while getting user saved posts");
  }
};
