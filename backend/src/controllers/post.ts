import { db } from "@/db/postgresql/connection";
import { comment } from "@/db/postgresql/schema/comment";
import { follow } from "@/db/postgresql/schema/follow";
import { likes } from "@/db/postgresql/schema/likes";
import { post } from "@/db/postgresql/schema/post";
import { story } from "@/db/postgresql/schema/story";
import { user } from "@/db/postgresql/schema/user";
import {
  AddCommentReqSchema,
  CategoryPostsReqSchema,
  CreatePostReqSchema,
  DeleteCommentReqSchema,
  DeletePostReqSchema,
  DeleteStoryReqSchema,
  GetCreatedAtReqSchema,
  UpdateLikeReqSchema,
} from "@/types/controllers/postReq";
import { CustomRequest } from "@/types/custom";
import { uploadMultiplesToCloudinary, uploadToCloudinary } from "@/utils/cloudinaryHandler";
import { deleteFile, deleteFiles } from "@/utils/deleteFile";
import { errRes } from "@/utils/error";
import { and, eq, sql, lt, desc } from "drizzle-orm";
import { Request, Response } from "express";

export const createPost = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId2 = (req as CustomRequest).userId2;

    // validation
    const createPostReq = CreatePostReqSchema.safeParse(req.body);
    if (!createPostReq.success) {
      if (req.files?.length) {
        deleteFiles(req.files);
      }
      return errRes(res, 400, `invalid data for post creation, ${createPostReq.error.toString()}`);
    }

    const data = createPostReq.data;

    const tags: string[] = [];
    if (data.tags) {
      const checkTags: string[] = JSON.parse(data.tags);
      if (!checkTags || checkTags.length === 0 || checkTags.includes("")) {
        if (req.files?.length) {
          deleteFiles(req.files);
        }
        return errRes(res, 400, "tags present in req, but invalid data in after parsing");
      }
      tags.concat(checkTags);
    }

    const content: string[] = [];
    if (data.tags) {
      const checkContent: string[] = JSON.parse(data.tags);
      if ((!checkContent || checkContent.length === 0, checkContent.includes(""))) {
        if (req.files?.length) {
          deleteFiles(req.files);
        }
        return errRes(res, 400, "content present in req, but invalid data in after parsing");
      }
      content.concat(checkContent);
    }

    let secUrls;
    if (req.files?.length) {
      const files: Express.Multer.File[] = req.files as Express.Multer.File[];
      const checkUpload = files.length;
      secUrls = await uploadMultiplesToCloudinary(files);
      if (secUrls.length < 1 || checkUpload !== secUrls.length) {
        if (req.files?.length) {
          deleteFiles(req.files);
        }
        return errRes(res, 500, "error while uploading files to cloudinay");
      }
    }

    const newPost = await db
      .insert(post)
      .values({
        userId: userId2,
        category: data.category,
        title: data.title,
        mediaUrls: secUrls ? secUrls : [],
        tags: tags,
        content: content,
      })
      .returning({
        id: post.id,
        userId: post.userId,
        category: post.category,
        title: post.title,
        mediaUrls: post.mediaUrls,
        tags: post.tags,
        content: post.content,
        likesCount: post.likesCount,
        createdAt: post.createdAt,
      })
      .execute();

    return res.status(200).json({
      success: true,
      message: "post created",
      post: newPost[0],
    });
  } catch (error) {
    if (req.files?.length) {
      deleteFiles(req.files);
    }
    return errRes(res, 500, "error while creating post", error);
  }
};

export const deletePost = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId2 = (req as CustomRequest).userId2;

    const deletePostReq = DeletePostReqSchema.safeParse(req.query);
    if (!deletePostReq.success) {
      return errRes(res, 400, `invalid data for postId delete, ${deletePostReq.error.toString()}`);
    }

    const data = deletePostReq.data;

    const intPostId = parseInt(data.postId);

    const postRes = await db
      .delete(post)
      .where(and(eq(post.id, intPostId), eq(post.userId, userId2)))
      .returning({ id: post.id })
      .execute();

    // check query response
    if (postRes.length) {
      return res.status(200).json({
        success: true,
        message: "post deleted successfully",
      });
    }
    return errRes(res, 400, "postId is invalid, no post present for postId to delete");
  } catch (error) {
    return errRes(res, 500, "error while deleting post", error);
  }
};

export const createStory = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId2 = (req as CustomRequest).userId2;

    if (!req.file) {
      return errRes(res, 400, "media file not present for story");
    }

    const secUrl = await uploadToCloudinary(req.file);
    if (secUrl === null) {
      if (req.file) {
        deleteFile(req.file);
      }
      return errRes(res, 500, "error while uploading media file to cloudinary");
    }

    const newStory = await db
      .insert(story)
      .values({ userId: userId2, storyUrl: secUrl })
      .returning({ id: story.id })
      .execute();

    return res.status(200).json({
      success: true,
      message: "story created successfully",
      id: newStory[0]?.id,
      storyUrl: secUrl,
    });
  } catch (error) {
    if (req.file) {
      deleteFile(req.file);
    }
    return errRes(res, 500, "error while creating story", error);
  }
};

export const deleteStory = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId2 = (req as CustomRequest).userId2;

    const deleteStoryReq = DeleteStoryReqSchema.safeParse(req.query);
    if (!deleteStoryReq.success) {
      return errRes(res, 400, `invalid data for storyId delete, ${deleteStoryReq.error.toString()}`);
    }

    const data = deleteStoryReq.data;

    const intStoryId = parseInt(data.storyId);

    const response = await db
      .delete(story)
      .where(and(eq(story.id, intStoryId), eq(story.userId, userId2)))
      .returning({ id: story.id })
      .execute();

    // check query response
    if (response.length) {
      return res.status(200).json({
        success: true,
        message: "story deleted successfully",
      });
    }
    return errRes(res, 400, "stroyId is invalid for deleting story");
  } catch (error) {
    return errRes(res, 500, "error while deleting story", error);
  }
};

export const updateLike = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId2 = (req as CustomRequest).userId2;

    const updateLikeReq = UpdateLikeReqSchema.safeParse(req.query);

    if (!updateLikeReq.success) {
      return errRes(res, 400, `invalid data for update like, ${updateLikeReq.error.toString()}`);
    }

    const data = updateLikeReq.data;

    const intPostId = parseInt(data.postId);

    // update is add
    if (data.update === "add") {
      // send query to database
      const likesRes = await db.transaction(async (tx) => {
        // check if like is already present for post by user
        const likeExists = await tx
          .insert(likes)
          .values({ userId: userId2, postId: intPostId })
          .onConflictDoNothing({ target: [likes.userId, likes.postId] })
          .returning({ id: likes.id });

        // if like is already present return false
        if (likeExists.length === 0) {
          return false;
        }

        // update likes count in the post row where postId is equal to post.id
        await tx
          .update(post)
          .set({ likesCount: sql`${post.likesCount} + 1` })
          .where(eq(post.id, intPostId));

        return true;
      });

      // check database query response
      if (likesRes) {
        return res.status(200).json({
          success: true,
          message: "like updated for post",
        });
      }
      return errRes(res, 400, "like is already present for post by user");
    }

    // update is delete
    // send query to database
    const likesRes = await db.transaction(async (tx) => {
      // check if like is present for post by user
      const likeExists = await tx
        .select()
        .from(likes)
        .where(and(eq(likes.postId, intPostId), eq(likes.userId, userId2)))
        .limit(1)
        .execute();

      // like is present then delete it
      if (likeExists.length > 0) {
        // delete like
        await tx
          .delete(likes)
          .where(and(eq(likes.postId, intPostId), eq(likes.userId, userId2)))
          .execute();

        // update like count
        await tx
          .update(post)
          .set({ likesCount: sql`${post.likesCount} - 1` })
          .where(eq(post.id, intPostId));

        return true;
      } else {
        // their is no like present for post by user return false
        return false;
      }
    });

    // check database query response
    if (likesRes) {
      return res.status(200).json({
        success: true,
        message: "like updated for post",
      });
    }
    return errRes(res, 400, "no like is present for post by user");
  } catch (error) {
    return errRes(res, 500, "error while updating like for post", error);
  }
};

export const addComment = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId2 = (req as CustomRequest).userId2;

    const addCommentReq = AddCommentReqSchema.safeParse(req.body);
    if (!addCommentReq.success) {
      return errRes(res, 400, `invalid data for comment, ${addCommentReq.error.toString()}`);
    }

    const data = addCommentReq.data;
    const newComment = await db
      .insert(comment)
      .values({ userId: userId2, postId: parseInt(data.postId), text: data.comment })
      .returning({ id: comment.id, userId: comment.userId, text: comment.text, createdAt: comment.createdAt })
      .execute();

    return res.status(200).json({
      success: true,
      message: "comment added",
      comment: newComment[0],
    });
  } catch (error) {
    return errRes(res, 500, "error while adding comment for post", error);
  }
};

export const deleteComment = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId2 = (req as CustomRequest).userId2;

    const deleteCommentReq = DeleteCommentReqSchema.safeParse(req.query);
    if (!deleteCommentReq.success) {
      return errRes(res, 400, `invalid data for deleting comment, ${deleteCommentReq.error.toString()}`);
    }

    const data = deleteCommentReq.data;

    const commentRes = await db
      .delete(comment)
      .where(and(eq(comment.id, parseInt(data.commentId)), eq(comment.userId, userId2)))
      .returning({ id: comment.id })
      .execute();

    if (commentRes.length) {
      return res.status(200).json({
        success: true,
        message: "comment deleted",
      });
    }

    return errRes(res, 400, "invalid id for deleting comment");
  } catch (error) {
    return errRes(res, 500, "error while deleting comment for post", error);
  }
};

export const getStories = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId2 = (req as CustomRequest).userId2;

    const getStoriesReq = GetCreatedAtReqSchema.safeParse(req.query);

    if (!getStoriesReq.success) {
      return errRes(res, 400, `invalid data for getting stories, ${getStoriesReq.error.toString()}`);
    }
    const data = getStoriesReq.data;

    const beforeAt = new Date(`${data.createdAt}`);
    const stories = await db
      .select({
        userName: user.userName,
        imageUrl: user.imageUrl,
        storyUrl: story.storyUrl,
        createdAt: story.createdAt,
      })
      .from(story)
      .leftJoin(follow, eq(story.userId, follow.followingId))
      .leftJoin(user, eq(story.userId, user.id))
      .where(and(eq(follow.followerId, userId2), lt(story.createdAt, beforeAt)))
      .orderBy(desc(story.createdAt))
      .limit(15)
      .execute();

    if (stories.length) {
      return res.status(200).json({
        success: true,
        message: "stories for user",
        stories: stories,
      });
    }
    return res.status(200).json({
      success: false,
      message: "no further stories for user",
    });
  } catch (error) {
    return errRes(res, 500, "error while getting stories", error);
  }
};

export const recentPosts = async (req: Request, res: Response): Promise<Response> => {
  try {
    const recentPostsReq = GetCreatedAtReqSchema.safeParse(req.query);
    if (!recentPostsReq.success) {
      return errRes(res, 400, `invalid data for recentPosts, ${recentPostsReq.error.toString()}`);
    }

    const data = recentPostsReq.data;

    const recentPosts = await db
      .select({
        id: post.id,
        userId: post.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        category: post.category,
        title: post.title,
        mediaUrls: post.mediaUrls,
        tags: post.tags,
        content: post.content,
        likesCount: post.likesCount,
        createdAt: post.createdAt,
      })
      .from(post)
      .leftJoin(user, eq(post.userId, user.id))
      .where(lt(post.createdAt, new Date(data.createdAt)))
      .orderBy(desc(post.createdAt))
      .limit(15)
      .execute();

    if (recentPosts.length) {
      return res.status(200).json({
        success: true,
        message: "recent posts",
        posts: recentPosts,
      });
    }
    return res.status(200).json({
      success: false,
      message: "no further recent posts",
    });
  } catch (error) {
    return errRes(res, 500, "error while getting trending posts");
  }
};

export const trendingPosts = async (req: Request, res: Response): Promise<Response> => {
  try {
    const trendingPostsReq = GetCreatedAtReqSchema.safeParse(req.query);
    if (!trendingPostsReq.success) {
      return errRes(res, 400, `invalid data for trendingPosts, ${trendingPostsReq.error.toString()}`);
    }

    const data = trendingPostsReq.data;

    const trendingPosts = await db
      .select({
        id: post.id,
        userId: post.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        category: post.category,
        title: post.title,
        mediaUrls: post.mediaUrls,
        tags: post.tags,
        content: post.content,
        likesCount: post.likesCount,
        createdAt: post.createdAt,
      })
      .from(post)
      .leftJoin(user, eq(post.userId, user.id))
      .where(lt(post.createdAt, new Date(data.createdAt)))
      .orderBy(desc(post.likesCount), desc(post.createdAt))
      .limit(15)
      .execute();

    if (trendingPosts.length) {
      return res.status(200).json({
        success: true,
        message: "trending posts",
        posts: trendingPosts,
      });
    }
    return res.status(200).json({
      success: false,
      message: "no further trending posts",
    });
  } catch (error) {
    return errRes(res, 500, "error while getting trending posts");
  }
};

export const categoryPosts = async (req: Request, res: Response): Promise<Response> => {
  try {
    const categoryPostsReq = CategoryPostsReqSchema.safeParse(req.query);
    if (!categoryPostsReq.success) {
      return errRes(res, 400, `invalid data for category post, ${categoryPostsReq.error.toString()}`);
    }

    const data = categoryPostsReq.data;

    const categoryPosts = await db
      .select({
        id: post.id,
        userId: post.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        category: post.category,
        title: post.title,
        mediaUrls: post.mediaUrls,
        tags: post.tags,
        content: post.content,
        likesCount: post.likesCount,
        createdAt: post.createdAt,
      })
      .from(post)
      .leftJoin(user, eq(post.userId, user.id))
      .where(and(eq(post.category, data.category), lt(post.createdAt, new Date(data.createdAt))))
      .orderBy(desc(post.createdAt))
      .limit(15)
      .execute();

    if (categoryPosts.length) {
      return res.status(200).json({
        success: true,
        message: "category posts",
        posts: categoryPosts,
      });
    }
    return res.status(200).json({
      success: false,
      message: "no further category posts",
    });
  } catch (error) {
    return errRes(res, 500, "error while getting category posts");
  }
};
