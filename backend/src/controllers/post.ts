import { db } from '@/db/postgresql/connection';
import { likes } from '@/db/postgresql/schema/likes';
import { post } from '@/db/postgresql/schema/post';
import { story } from '@/db/postgresql/schema/story';
import { user } from '@/db/postgresql/schema/user';
import { CreatePostReq } from '@/types/controllers/postReq';
import { CustomRequest } from '@/types/custom';
import { uploadMultiplesToCloudinary, uploadToCloudinary } from '@/utils/cloudinaryHandler';
import { deleteFile, deleteFiles } from '@/utils/deleteFile';
import { errRes } from '@/utils/error';
import valid from '@/validators/validator';
import { and, eq, sql } from 'drizzle-orm';
import { Request, Response } from 'express';

export const userBlogProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId2 = (req as CustomRequest).userId2;

        if (!userId2) {
            return errRes(res, 400, "invalid data, userId2 not present");
        }

        const blogProfile = await db.select({ followingCount: user.followingCount, followersCount: user.followersCount })
            .from(user).where(eq(user.id, userId2)).limit(1).execute();

        if (blogProfile.length !== 1) {
            return errRes(res, 400, "userId2 not present in database");
        }

        return res.status(200).json({
            success: true,
            message: "user blog profile data",
            blogProfile: blogProfile[0]
        });

    } catch (error) {
        return errRes(res, 500, "error while getting userBlogProfile data", error);
    }
};

export const createPost = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId2 = (req as CustomRequest).userId2;

        if (!userId2) {
            if (req.files?.length) {
                deleteFiles(req.files);
            }
            return errRes(res, 400, "invalid data, userId2 not present");
        }

        const data: CreatePostReq = req.body;

        if (!data.category || !valid.isCategory(data.category) || (!req.files?.length && !data.content)) {
            if (req.files?.length) {
                deleteFiles(req.files);
            }
            return errRes(res, 400, "invalid data for post creation");
        }

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
            if (!checkContent || checkContent.length === 0, checkContent.includes("")) {
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

        const newPost = await db.insert(post).values({
            userId: userId2,
            category: data.category,
            title: data.title,
            mediaUrls: secUrls ? secUrls : [],
            tags: tags,
            content: content
        }).returning({
            id: post.id,
            userId: post.userId,
            category: post.category,
            title: post.title,
            mediaUrls: post.mediaUrls,
            tags: post.tags,
            content: post.content,
            likesCount: post.likesCount,
            createdAt: post.createdAt
        });

        return res.status(200).json({
            success: true,
            message: "post created",
            post: newPost[0]
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

        if (!userId2) {
            return errRes(res, 400, "invalid data, userId2 not present");
        }

        const { postId } = req.query;
        if (!postId) {
            return errRes(res, 400, "postId not present in querry");
        }

        const intPostId = parseInt(`${postId}`);
        await db.delete(post).where(eq(post.id, intPostId));

        return res.status(200).json({
            success: true,
            message: "post deleted successfully"
        });

    } catch (error) {
        return errRes(res, 500, "error while deleting post", error);
    }
};

export const createStory = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId2 = (req as CustomRequest).userId2;

        if (!userId2) {
            return errRes(res, 400, "invalid data, userId2 not present");
        }

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

        const newStory = await db.insert(story).values({ userId: userId2, storyUrl: secUrl }).
            returning({ id: story.id }).execute();

        return res.status(200).json({
            success: true,
            message: "story created successfully",
            id: newStory[0]?.id
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

        if (!userId2) {
            return errRes(res, 400, "invalid data, userId2 not present");
        }

        const { storyId } = req.query;
        if (!storyId) {
            return errRes(res, 400, "storyId not present in querry");
        }

        const intStoryId = parseInt(`${storyId}`);
        await db.delete(story).where(eq(story.id, intStoryId));

        return res.status(200).json({
            success: true,
            message: "story deleted successfully"

        });
    } catch (error) {
        return errRes(res, 500, "error while deleting story", error);
    }
};

export const updateLike = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId2 = (req as CustomRequest).userId2;

        if (!userId2) {
            return errRes(res, 400, "invalid data, userId2 not present");
        }

        const { postId, update } = req.query;
        if (!postId) {
            return errRes(res, 400, "postId not present in querry");
        }

        const intPostId = parseInt(`${postId}`);

        // update is add or delete
        if (`${update}` === "add") {
            // check if like is already present
            const result = await db.select().from(likes)
                .where(and(eq(likes.userId, userId2), eq(likes.postId, intPostId)))
                .limit(1)
                .execute();

            if (result.length !== 0) {
                return errRes(res, 400, "post already liked by user");
            }

            // insert like data in likes
            await db.insert(likes).values({ userId: userId2, postId: intPostId });

            // update likes count in post row where postId is equall to post.id
            await db.update(post)
                .set({ likesCount: sql`${post.likesCount} + 1` })
                .where(eq(post.id, intPostId));
        }
        else {
            // delete like data in likes
            await db.delete(likes).where(eq(likes.postId, intPostId));

            // update likes count in post row where postId is equall to post.id
            await db.update(post)
                .set({ likesCount: sql`${post.likesCount} - 1` })
                .where(eq(post.id, intPostId));
        }

        return res.status(200).json({
            success: true,
            message: "like updated for post"
        });

    } catch (error) {
        return errRes(res, 500, "error while updating like for post", error);
    }
};
