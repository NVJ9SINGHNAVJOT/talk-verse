import { db } from '@/db/postgresql/connection';
import { post } from '@/db/postgresql/schema/post';
import { user } from '@/db/postgresql/schema/user';
import { CreatePostReq } from '@/types/controllers/postReq';
import { CustomRequest } from '@/types/custom';
import { uploadMultiplesToCloudinary } from '@/utils/cloudinaryHandler';
import { deleteFiles } from '@/utils/deleteFile';
import { errRes } from '@/utils/error';
import valid from '@/validators/validator';
import { eq } from 'drizzle-orm';
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
            mediaUrls: secUrls,
            tags: tags,
            content: content
        }).returning({
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