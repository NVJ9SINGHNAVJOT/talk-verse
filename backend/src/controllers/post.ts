import { db } from "@/db/postgresql/connection";
import { comment } from "@/db/postgresql/schema/comment";
import { follow } from "@/db/postgresql/schema/follow";
import { likes } from "@/db/postgresql/schema/likes";
import { post } from "@/db/postgresql/schema/post";
import { save } from "@/db/postgresql/schema/save";
import { story } from "@/db/postgresql/schema/story";
import { user } from "@/db/postgresql/schema/user";
import { GetCreatedAtReqSchema } from "@/types/controllers/common";
import {
  AddCommentReqSchema,
  CategoryPostsReqSchema,
  CreatePostReqSchema,
  DeleteCommentReqSchema,
  DeletePostReqSchema,
  DeleteStoryReqSchema,
  PostCommentsReqSchema,
  SavePostReqSchema,
  UpdateLikeReqSchema,
} from "@/types/controllers/postReq";
import { CustomRequest } from "@/types/custom";
import { deleteFromCloudinay, uploadMultiplesToCloudinary, uploadToCloudinary } from "@/utils/cloudinaryHandler";
import { deleteFile, deleteFiles } from "@/utils/deleteFile";
import { errRes } from "@/utils/error";
import { checkContent, checkTags } from "@/utils/helpers";
import { and, eq, sql, lt, desc, gt, asc } from "drizzle-orm";
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
      return errRes(res, 400, `invalid data for post creation, ${createPostReq.error.message}`);
    }

    const data = createPostReq.data;

    let tags;
    if (data.tags) {
      tags = checkTags(data.tags);
      if (tags.length === 0) {
        if (req.files?.length) {
          deleteFiles(req.files);
        }
        return errRes(res, 400, "tags present in req, but invalid data after parsing");
      }
    }

    let content;
    if (data.content) {
      content = checkContent(data.content);
      if (content.length === 0) {
        if (req.files?.length) {
          deleteFiles(req.files);
        }
        return errRes(res, 400, "content present in req, but invalid data after parsing");
      }
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
        mediaUrls: secUrls && secUrls,
        tags: tags && tags,
        content: content && content,
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (req.files?.length) {
      deleteFiles(req.files);
    }
    return errRes(res, 500, "error while creating post", error.message);
  }
};

export const deletePost = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId2 = (req as CustomRequest).userId2;

    const deletePostReq = DeletePostReqSchema.safeParse(req.body);
    if (!deletePostReq.success) {
      return errRes(res, 400, `invalid data for postId delete, ${deletePostReq.error.message}`);
    }

    const data = deletePostReq.data;

    // set isPostDeleted to true for post
    const postRes = await db
      .update(post)
      .set({ isPostDeleted: true })
      .where(and(eq(post.id, data.postId), eq(post.userId, userId2), eq(post.isPostDeleted, false)))
      .returning({ id: post.id, mediaUrls: post.mediaUrls })
      .execute();

    // check query response
    if (postRes.length) {
      /* 
        NOTE: currently media files are not deleted after post delete.
        TODO: separate api to be made to delete posts having 'isPostDeleted: true' from database and
        remove media files from cloudinary.
      */
      return res.status(200).json({
        success: true,
        message: "post deleted successfully",
      });
    }
    return errRes(res, 400, "postId is invalid, no post present for postId to delete");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return errRes(res, 500, "error while deleting post", error.message);
  }
};

export const savePost = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId2 = (req as CustomRequest).userId2;

    const savePostReq = SavePostReqSchema.safeParse(req.body);
    if (!savePostReq.success) {
      return errRes(res, 400, `invalid id to save post, ${savePostReq.error.message}`);
    }

    const data = savePostReq.data;

    if (data.update === "add") {
      /*
        check if post with postId should not have userId as userId2.
        because user cannot save it's own created post.
      */
      const checkIfUserCreatedPost = await db
        .select({ id: post.id })
        .from(post)
        .where(and(eq(post.id, data.postId), eq(post.userId, userId2)));

      if (checkIfUserCreatedPost.length !== 0) {
        return errRes(res, 400, "user cannot save it's own post");
      }

      const checkSavedPost = await db
        .insert(save)
        .values({ userId: userId2, postId: data.postId })
        .onConflictDoNothing({ target: [save.userId, save.postId] })
        .returning({ id: save.id });

      if (checkSavedPost.length === 0) {
        return errRes(res, 400, "invalid data, post is already saved by user");
      }

      return res.status(200).json({
        success: true,
        message: "post save for user",
      });
    }

    const deleteSavedPost = await db
      .delete(save)
      .where(and(eq(save.userId, userId2), eq(save.postId, data.postId)))
      .returning({ id: save.id });

    if (deleteSavedPost.length === 0) {
      return errRes(res, 400, "invalid data, no post previously saved by user");
    }

    return res.status(200).json({
      success: true,
      message: "post removed from save for user",
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return errRes(res, 500, "error while updating save post for user", error.message);
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
      .returning({ id: story.id, storyUrl: story.storyUrl })
      .execute();

    return res.status(200).json({
      success: true,
      message: "story created successfully",
      story: newStory[0],
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (req.file) {
      deleteFile(req.file);
    }
    return errRes(res, 500, "error while creating story", error.message);
  }
};

export const deleteStory = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId2 = (req as CustomRequest).userId2;

    const deleteStoryReq = DeleteStoryReqSchema.safeParse(req.query);
    if (!deleteStoryReq.success) {
      return errRes(res, 400, `invalid data for storyId delete, ${deleteStoryReq.error.message}`);
    }

    const data = deleteStoryReq.data;

    const intStoryId = parseInt(data.storyId);

    const response = await db
      .delete(story)
      .where(and(eq(story.id, intStoryId), eq(story.userId, userId2)))
      .returning({ id: story.id, storyUrl: story.storyUrl })
      .execute();

    // check query response
    if (response.length) {
      // delete from cloundinary
      if (response[0]) {
        deleteFromCloudinay(response[0].storyUrl);
      }
      return res.status(200).json({
        success: true,
        message: "story deleted successfully",
      });
    }
    return errRes(res, 400, "stroyId is invalid for deleting story");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return errRes(res, 500, "error while deleting story", error.message);
  }
};

export const userStory = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId2 = (req as CustomRequest).userId2;

    const userStoryUrl = await db
      .select({ id: story.id, storyUrl: story.storyUrl })
      .from(story)
      .where(and(eq(story.userId, userId2), gt(story.createdAt, sql`now() - interval '1 day'`)))
      .limit(1)
      .execute();

    if (userStoryUrl.length === 0) {
      return res.status(200).json({
        success: false,
        message: "not story for user",
      });
    }

    return res.status(200).json({
      success: true,
      message: "story for user",
      story: userStoryUrl[0],
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return errRes(res, 500, "error while getting user story", error.message);
  }
};

export const updateLike = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId2 = (req as CustomRequest).userId2;

    const updateLikeReq = UpdateLikeReqSchema.safeParse(req.query);

    if (!updateLikeReq.success) {
      return errRes(res, 400, `invalid data for update like, ${updateLikeReq.error.message}`);
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
          .where(eq(post.id, intPostId))
          .execute();

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return errRes(res, 500, "error while updating like for post", error.message);
  }
};

export const addComment = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId2 = (req as CustomRequest).userId2;

    const addCommentReq = AddCommentReqSchema.safeParse(req.body);
    if (!addCommentReq.success) {
      return errRes(res, 400, `invalid data for comment, ${addCommentReq.error.message}`);
    }

    const data = addCommentReq.data;
    const newComment = await db
      .insert(comment)
      .values({ userId: userId2, postId: data.postId, commentText: data.commentText })
      .returning({
        id: comment.id,
        commentText: comment.commentText,
        createdAt: comment.createdAt,
      })
      .execute();

    await db
      .update(post)
      .set({ commentsCount: sql`${post.commentsCount} + 1` })
      .where(eq(post.id, data.postId))
      .execute();

    return res.status(200).json({
      success: true,
      message: "comment added",
      comment: newComment[0],
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return errRes(res, 500, "error while adding comment for post", error.message);
  }
};

export const deleteComment = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId2 = (req as CustomRequest).userId2;

    const deleteCommentReq = DeleteCommentReqSchema.safeParse(req.body);
    if (!deleteCommentReq.success) {
      return errRes(res, 400, `invalid data for deleting comment, ${deleteCommentReq.error.message}`);
    }

    const data = deleteCommentReq.data;

    const commentRes = await db
      .delete(comment)
      .where(and(eq(comment.id, data.commentId), eq(comment.userId, userId2)))
      .returning({ id: comment.id })
      .execute();

    if (commentRes.length) {
      await db
        .update(post)
        .set({ commentsCount: sql`${post.commentsCount} - 1` })
        .where(eq(post.id, data.postId))
        .execute();

      return res.status(200).json({
        success: true,
        message: "comment deleted",
      });
    }

    return errRes(res, 400, "invalid id for deleting comment");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return errRes(res, 500, "error while deleting comment for post", error.message);
  }
};

export const postComments = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId2 = (req as CustomRequest).userId2;
    const postCommentsReq = PostCommentsReqSchema.safeParse(req.query);

    if (!postCommentsReq.success) {
      return errRes(res, 400, `invalid data for getting post comments, ${postCommentsReq.error.message}`);
    }

    const data = postCommentsReq.data;
    const beforeAt = new Date(`${data.createdAt}`);

    const comments = await db
      .select({
        id: comment.id,
        isCurrentUser: sql<boolean>`CASE WHEN ${comment.userId} = ${userId2} THEN TRUE ELSE FALSE END`,
        userId: comment.userId,
        imageUrl: user.imageUrl,
        userName: user.userName,
        commentText: comment.commentText,
        createdAt: comment.createdAt,
      })
      .from(comment)
      .innerJoin(user, eq(comment.userId, user.id))
      .where(and(eq(comment.postId, parseInt(data.postId)), lt(comment.createdAt, beforeAt)))
      .orderBy(asc(comment.createdAt))
      .limit(15)
      .execute();

    if (comments.length === 0) {
      return res.status(200).json({
        success: false,
        message: "no further comments for post",
      });
    }

    return res.status(200).json({
      success: true,
      message: "comments for post",
      comments: comments,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return errRes(res, 500, "error while getting comments for post", error.message);
  }
};
export const getStories = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId2 = (req as CustomRequest).userId2;

    const getStoriesReq = GetCreatedAtReqSchema.safeParse(req.query);

    if (!getStoriesReq.success) {
      return errRes(res, 400, `invalid data for getting stories, ${getStoriesReq.error.message}`);
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
      .innerJoin(follow, eq(story.userId, follow.followingId))
      .innerJoin(user, eq(story.userId, user.id))
      .where(
        and(
          eq(follow.followerId, userId2),
          lt(story.createdAt, beforeAt),
          gt(story.createdAt, sql`now() - interval '1 day'`)
        )
      )
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return errRes(res, 500, "error while getting stories", error.message);
  }
};

export const recentPosts = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId2 = (req as CustomRequest).userId2;

    const recentPostsReq = GetCreatedAtReqSchema.safeParse(req.query);
    if (!recentPostsReq.success) {
      return errRes(res, 400, `invalid data for recentPosts, ${recentPostsReq.error.message}`);
    }

    const data = recentPostsReq.data;

    const recentPosts = await db
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
      .innerJoin(user, eq(post.userId, user.id))
      .leftJoin(save, and(eq(save.postId, post.id), eq(save.userId, userId2)))
      .leftJoin(likes, and(eq(likes.userId, userId2), eq(likes.postId, post.id)))
      .where(and(lt(post.createdAt, new Date(data.createdAt)), eq(post.isPostDeleted, false)))
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return errRes(res, 500, "error while getting trending posts");
  }
};

export const trendingPosts = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId2 = (req as CustomRequest).userId2;

    const trendingPostsReq = GetCreatedAtReqSchema.safeParse(req.query);
    if (!trendingPostsReq.success) {
      return errRes(res, 400, `invalid data for trendingPosts, ${trendingPostsReq.error.message}`);
    }

    const data = trendingPostsReq.data;

    const trendingPosts = await db
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
      .innerJoin(user, eq(post.userId, user.id))
      .leftJoin(save, and(eq(save.postId, post.id), eq(save.userId, userId2)))
      .leftJoin(likes, and(eq(likes.userId, userId2), eq(likes.postId, post.id)))
      .where(and(lt(post.createdAt, new Date(data.createdAt)), eq(post.isPostDeleted, false)))
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return errRes(res, 500, "error while getting trending posts");
  }
};

export const categoryPosts = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId2 = (req as CustomRequest).userId2;

    const categoryPostsReq = CategoryPostsReqSchema.safeParse(req.query);
    if (!categoryPostsReq.success) {
      return errRes(res, 400, `invalid data for category post, ${categoryPostsReq.error.message}`);
    }

    const data = categoryPostsReq.data;

    const categoryPosts = await db
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
      .innerJoin(user, eq(post.userId, user.id))
      .leftJoin(save, and(eq(save.postId, post.id), eq(save.userId, userId2)))
      .leftJoin(likes, and(eq(likes.userId, userId2), eq(likes.postId, post.id)))
      .where(
        and(
          eq(post.category, data.category),
          lt(post.createdAt, new Date(data.createdAt)),
          eq(post.isPostDeleted, false)
        )
      )
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return errRes(res, 500, "error while getting category posts");
  }
};
