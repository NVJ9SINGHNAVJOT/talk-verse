import { db } from "@/db/postgresql/connection";
import { comments } from "@/db/postgresql/schema/comments";
import { follows } from "@/db/postgresql/schema/follows";
import { likes } from "@/db/postgresql/schema/likes";
import { posts } from "@/db/postgresql/schema/posts";
import { saves } from "@/db/postgresql/schema/saves";
import { stories } from "@/db/postgresql/schema/stories";
import { users } from "@/db/postgresql/schema/users";
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
  TrendingPostsReqSchema,
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

    // content or media files - one should be present for creating post
    if (!content && !req.files?.length) {
      return errRes(res, 400, "content or media files - one should be present for creating post");
    }

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

    let secUrls;
    if (req.files?.length) {
      const files = req.files as Express.Multer.File[];
      const checkUpload = files.length;
      secUrls = await uploadMultiplesToCloudinary(files);
      if (checkUpload !== secUrls.length) {
        return errRes(res, 500, "error while uploading files to cloudinay");
      }
    }

    const newPost = await db
      .insert(posts)
      .values({
        userId: userId2,
        category: data.category,
        title: data.title,
        mediaUrls: secUrls && secUrls,
        tags: tags && tags,
        content: content && content,
      })
      .returning({
        id: posts.id,
        userId: posts.userId,
        category: posts.category,
        title: posts.title,
        mediaUrls: posts.mediaUrls,
        tags: posts.tags,
        content: posts.content,
        likesCount: posts.likesCount,
        createdAt: posts.createdAt,
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

    const deletePostReq = DeletePostReqSchema.safeParse(req.body);
    if (!deletePostReq.success) {
      return errRes(res, 400, `invalid data for postId delete, ${deletePostReq.error.message}`);
    }

    const data = deletePostReq.data;

    // set isPostDeleted to true for post
    const postRes = await db
      .update(posts)
      .set({ isPostDeleted: true })
      .where(and(eq(posts.id, data.postId), eq(posts.userId, userId2), eq(posts.isPostDeleted, false)))
      .returning({ id: posts.id, mediaUrls: posts.mediaUrls })
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
  } catch (error) {
    return errRes(res, 500, "error while deleting post", error);
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
        .select({ id: posts.id })
        .from(posts)
        .where(and(eq(posts.id, data.postId), eq(posts.userId, userId2)));

      if (checkIfUserCreatedPost.length !== 0) {
        return errRes(res, 400, "user cannot save it's own post");
      }

      const checkSavedPost = await db
        .insert(saves)
        .values({ userId: userId2, postId: data.postId })
        .onConflictDoNothing({ target: [saves.userId, saves.postId] })
        .returning({ id: saves.id });

      if (checkSavedPost.length === 0) {
        return errRes(res, 400, "invalid data, post is already saved by user");
      }

      return res.status(200).json({
        success: true,
        message: "post save for user",
      });
    }

    const deleteSavedPost = await db
      .delete(saves)
      .where(and(eq(saves.userId, userId2), eq(saves.postId, data.postId)))
      .returning({ id: saves.id });

    if (deleteSavedPost.length === 0) {
      return errRes(res, 400, "invalid data, no post previously saved by user");
    }

    return res.status(200).json({
      success: true,
      message: "post removed from save for user",
    });
  } catch (error) {
    return errRes(res, 500, "error while updating save post for user", error);
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
      .insert(stories)
      .values({ userId: userId2, storyUrl: secUrl })
      .returning({ id: stories.id, storyUrl: stories.storyUrl })
      .execute();

    return res.status(200).json({
      success: true,
      message: "story created successfully",
      story: newStory[0],
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
      return errRes(res, 400, `invalid data for storyId delete, ${deleteStoryReq.error.message}`);
    }

    const data = deleteStoryReq.data;

    const intStoryId = parseInt(data.storyId);

    const response = await db
      .delete(stories)
      .where(and(eq(stories.id, intStoryId), eq(stories.userId, userId2)))
      .returning({ id: stories.id, storyUrl: stories.storyUrl })
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
  } catch (error) {
    return errRes(res, 500, "error while deleting story", error);
  }
};

export const userStory = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId2 = (req as CustomRequest).userId2;

    const userStoryUrl = await db
      .select({ id: stories.id, storyUrl: stories.storyUrl })
      .from(stories)
      .where(and(eq(stories.userId, userId2), gt(stories.createdAt, sql`now() - interval '1 day'`)))
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
  } catch (error) {
    return errRes(res, 500, "error while getting user story", error);
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

        // update likes count in the post row where postId is equal to posts.id
        await tx
          .update(posts)
          .set({ likesCount: sql`${posts.likesCount} + 1` })
          .where(eq(posts.id, intPostId));

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
          .update(posts)
          .set({ likesCount: sql`${posts.likesCount} - 1` })
          .where(eq(posts.id, intPostId))
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
  } catch (error) {
    return errRes(res, 500, "error while updating like for post", error);
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
      .insert(comments)
      .values({ userId: userId2, postId: data.postId, commentText: data.commentText })
      .returning({
        id: comments.id,
        commentText: comments.commentText,
        createdAt: comments.createdAt,
      })
      .execute();

    await db
      .update(posts)
      .set({ commentsCount: sql`${posts.commentsCount} + 1` })
      .where(eq(posts.id, data.postId))
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

    const deleteCommentReq = DeleteCommentReqSchema.safeParse(req.body);
    if (!deleteCommentReq.success) {
      return errRes(res, 400, `invalid data for deleting comment, ${deleteCommentReq.error.message}`);
    }

    const data = deleteCommentReq.data;

    const commentRes = await db
      .delete(comments)
      .where(and(eq(comments.id, data.commentId), eq(comments.userId, userId2)))
      .returning({ id: comments.id })
      .execute();

    if (commentRes.length) {
      await db
        .update(posts)
        .set({ commentsCount: sql`${posts.commentsCount} - 1` })
        .where(eq(posts.id, data.postId))
        .execute();

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

export const postComments = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId2 = (req as CustomRequest).userId2;
    const postCommentsReq = PostCommentsReqSchema.safeParse(req.query);

    if (!postCommentsReq.success) {
      return errRes(res, 400, `invalid data for getting post comments, ${postCommentsReq.error.message}`);
    }

    const data = postCommentsReq.data;
    const beforeAt = new Date(`${data.createdAt}`);

    const commentsList = await db
      .select({
        id: comments.id,
        isCurrentUser: sql<boolean>`CASE WHEN ${comments.userId} = ${userId2} THEN TRUE ELSE FALSE END`,
        userId: comments.userId,
        imageUrl: users.imageUrl,
        userName: users.userName,
        commentText: comments.commentText,
        createdAt: comments.createdAt,
      })
      .from(comments)
      .innerJoin(users, eq(comments.userId, users.id))
      .where(and(eq(comments.postId, parseInt(data.postId)), lt(comments.createdAt, beforeAt)))
      .orderBy(asc(comments.createdAt))
      .limit(15)
      .execute();

    if (commentsList.length === 0) {
      return res.status(200).json({
        success: false,
        message: "no further comments for post",
      });
    }

    return res.status(200).json({
      success: true,
      message: "comments for post",
      comments: commentsList,
    });
  } catch (error) {
    return errRes(res, 500, "error while getting comments for post", error);
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
    const storiesList = await db
      .select({
        userName: users.userName,
        imageUrl: users.imageUrl,
        storyUrl: stories.storyUrl,
        createdAt: stories.createdAt,
      })
      .from(stories)
      .innerJoin(follows, eq(stories.userId, follows.followingId))
      .innerJoin(users, eq(stories.userId, users.id))
      .where(
        and(
          eq(follows.followerId, userId2),
          lt(stories.createdAt, beforeAt),
          gt(stories.createdAt, sql`now() - interval '1 day'`)
        )
      )
      .orderBy(desc(stories.createdAt))
      .limit(15)
      .execute();

    if (storiesList.length) {
      return res.status(200).json({
        success: true,
        message: "stories for user",
        stories: storiesList,
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
    const userId2 = (req as CustomRequest).userId2;

    const recentPostsReq = GetCreatedAtReqSchema.safeParse(req.query);
    if (!recentPostsReq.success) {
      return errRes(res, 400, `invalid data for recentPosts, ${recentPostsReq.error.message}`);
    }

    const data = recentPostsReq.data;

    const recentPosts = await db
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
      .innerJoin(users, eq(posts.userId, users.id))
      .leftJoin(saves, and(eq(saves.postId, posts.id), eq(saves.userId, userId2)))
      .leftJoin(likes, and(eq(likes.userId, userId2), eq(likes.postId, posts.id)))
      .where(and(lt(posts.createdAt, new Date(data.createdAt)), eq(posts.isPostDeleted, false)))
      .orderBy(desc(posts.createdAt))
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
    return errRes(res, 500, "error while getting trending posts", error);
  }
};

export const trendingPosts = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId2 = (req as CustomRequest).userId2;

    const trendingPostsReq = TrendingPostsReqSchema.safeParse(req.query);
    if (!trendingPostsReq.success) {
      return errRes(res, 400, `invalid data for trendingPosts, ${trendingPostsReq.error.message}`);
    }

    const data = trendingPostsReq.data;

    const trendingPosts = await db
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
      .innerJoin(users, eq(posts.userId, users.id))
      .leftJoin(saves, and(eq(saves.postId, posts.id), eq(saves.userId, userId2)))
      .leftJoin(likes, and(eq(likes.userId, userId2), eq(likes.postId, posts.id)))
      .where(eq(posts.isPostDeleted, false))
      .orderBy(desc(posts.likesCount), desc(posts.createdAt))
      .limit(15)
      .offset(Number(data.skip))
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
    return errRes(res, 500, "error while getting trending posts", error);
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
      .innerJoin(users, eq(posts.userId, users.id))
      .leftJoin(saves, and(eq(saves.postId, posts.id), eq(saves.userId, userId2)))
      .leftJoin(likes, and(eq(likes.userId, userId2), eq(likes.postId, posts.id)))
      .where(
        and(
          eq(posts.category, data.category),
          lt(posts.createdAt, new Date(data.createdAt)),
          eq(posts.isPostDeleted, false)
        )
      )
      .orderBy(desc(posts.createdAt))
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
    return errRes(res, 500, "error while getting category posts", error);
  }
};
