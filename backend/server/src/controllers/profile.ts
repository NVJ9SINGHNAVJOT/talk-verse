import User from "@/db/mongodb/models/User";
import { db } from "@/db/postgresql/connection";
import { follows } from "@/db/postgresql/schema/follows";
import { likes } from "@/db/postgresql/schema/likes";
import { posts } from "@/db/postgresql/schema/posts";
import { saves } from "@/db/postgresql/schema/saves";
import { users } from "@/db/postgresql/schema/users";
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
  } catch (error) {
    return errRes(res, 500, "error while getting user profile data", error);
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
    await db.update(users).set({ imageUrl: secUrl }).where(eq(users.id, userId2)).execute();

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
      await db.update(users).set({ userName: data.userName }).where(eq(users.refId, userId)).execute();
    }
    await mongoUser.save();

    return res.status(200).json({
      success: true,
      message: "user details updated successfully",
      userData: mongoUser,
    });
  } catch (error) {
    return errRes(res, 500, "error while updating user details", error);
  }
};

export const userBlogProfile = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId2 = (req as CustomRequest).userId2;

    const blogProfile = await db
      .select({ followingCount: users.followingCount, followersCount: users.followersCount })
      .from(users)
      .where(eq(users.id, userId2))
      .limit(1)
      .execute();

    const totalPosts = await db
      .select({ count: count() })
      .from(posts)
      .where(and(eq(posts.userId, userId2), eq(posts.isPostDeleted, false)));

    return res.status(200).json({
      success: true,
      message: "user blog profile data",
      blogProfile: {
        followingCount: blogProfile[0]?.followingCount,
        followersCount: blogProfile[0]?.followersCount,
        totalPosts: totalPosts[0]?.count,
      },
    });
  } catch (error) {
    return errRes(res, 500, "error while getting userBlogProfile data", error);
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
        id: posts.id,
        isCurrentUser: sql<boolean>`CASE WHEN ${posts.userId} = ${userId2} THEN TRUE ELSE FALSE END`,
        firstName: users.firstName,
        lastName: users.lastName,
        imageUrl: users.imageUrl,
        userName: users.userName,
        isSaved: sql<boolean>`CASE WHEN ${saves.userId} = ${userId2} AND ${saves.postId} = ${posts.id} THEN TRUE ELSE FALSE END`,
        isLiked: sql<boolean>`CASE WHEN ${likes.userId} = ${userId2} AND ${likes.postId} = ${posts.id} THEN TRUE ELSE FALSE END`,
        commentsCount: posts.commentsCount,
        category: posts.category,
        title: posts.title,
        mediaUrls: posts.mediaUrls,
        tags: posts.tags,
        content: posts.content,
        likesCount: posts.likesCount,
        createdAt: posts.createdAt,
      })
      .from(posts)
      .innerJoin(users, and(eq(posts.userId, users.id), eq(users.id, userId2)))
      .leftJoin(saves, and(eq(saves.postId, posts.id), eq(saves.userId, userId2)))
      .leftJoin(likes, and(eq(likes.userId, userId2), eq(likes.postId, posts.id)))
      .where(
        and(eq(posts.userId, userId2), lt(posts.createdAt, new Date(data.createdAt)), eq(posts.isPostDeleted, false))
      )
      .orderBy(desc(posts.createdAt))
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
  } catch (error) {
    return errRes(res, 500, "error while getting user posts", error);
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
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        imageUrl: users.imageUrl,
        userName: users.userName,
        createdAt: follows.createdAt,
      })
      .from(follows)
      .innerJoin(users, eq(follows.followingId, users.id))
      .where(and(eq(follows.followerId, userId2), lt(follows.createdAt, new Date(data.createdAt))))
      .limit(20)
      .orderBy(desc(follows.createdAt))
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
  } catch (error) {
    return errRes(res, 500, "error while getting user following", error);
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
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        imageUrl: users.imageUrl,
        userName: users.userName,
        createdAt: follows.createdAt,
      })
      .from(follows)
      .innerJoin(users, eq(follows.followerId, users.id))
      .where(and(eq(follows.followingId, userId2), lt(follows.createdAt, new Date(data.createdAt))))
      .limit(20)
      .orderBy(desc(follows.createdAt))
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
  } catch (error) {
    return errRes(res, 500, "error while getting user followers", error);
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
      .delete(follows)
      .where(and(eq(follows.followingId, userId2), eq(follows.followerId, data.otherUserId)))
      .returning({ id: follows.id })
      .execute();

    if (checkRemoveFollwer.length !== 0) {
      // decrease current user followersCount by 1
      await db
        .update(users)
        .set({ followersCount: sql`${users.followersCount} - 1` })
        .where(eq(users.id, userId2));

      // decrease otherUserId user followingCount by 1
      await db
        .update(users)
        .set({ followingCount: sql`${users.followingCount} - 1` })
        .where(eq(users.id, data.otherUserId));

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
  } catch (error) {
    return errRes(res, 500, "error while removing follower", error);
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
      .delete(follows)
      .where(and(eq(follows.followingId, data.otherUserId), eq(follows.followerId, userId2)))
      .returning({ id: follows.id })
      .execute();

    if (checkUnfollowUser.length !== 0) {
      // decrease current user followingCount by 1
      await db
        .update(users)
        .set({ followersCount: sql`${users.followingCount} - 1` })
        .where(eq(users.id, userId2));

      // decrease otherUserId user followersCount by 1
      await db
        .update(users)
        .set({ followingCount: sql`${users.followersCount} - 1` })
        .where(eq(users.id, data.otherUserId));

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
  } catch (error) {
    return errRes(res, 500, "error while removing following other user", error);
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
        id: posts.id,
        isCurrentUser: sql<boolean>`CASE WHEN ${posts.userId} = ${userId2} THEN TRUE ELSE FALSE END`,
        firstName: users.firstName,
        lastName: users.lastName,
        imageUrl: users.imageUrl,
        userName: users.userName,
        isSaved: sql<boolean>`CASE WHEN ${saves.userId} = ${userId2} AND ${saves.postId} = ${posts.id} THEN TRUE ELSE FALSE END`,
        isLiked: sql<boolean>`CASE WHEN ${likes.userId} = ${userId2} AND ${likes.postId} = ${posts.id} THEN TRUE ELSE FALSE END`,
        commentsCount: posts.commentsCount,
        category: posts.category,
        title: posts.title,
        mediaUrls: posts.mediaUrls,
        tags: posts.tags,
        content: posts.content,
        likesCount: posts.likesCount,
        createdAt: posts.createdAt,
      })
      .from(saves)
      .innerJoin(posts, and(eq(posts.id, saves.postId), eq(saves.userId, userId2)))
      .innerJoin(users, eq(posts.userId, users.id))
      .leftJoin(likes, and(eq(likes.userId, userId2), eq(likes.postId, posts.id)))
      .where(
        and(eq(saves.userId, userId2), lt(posts.createdAt, new Date(data.createdAt)), eq(posts.isPostDeleted, false))
      )
      .orderBy(desc(saves.createdAt))
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
  } catch (error) {
    return errRes(res, 500, "error while getting user saved posts", error);
  }
};
