import { db } from '@/db/postgresql/connection';
import { post } from '@/db/postgresql/schema/post';
import { user } from '@/db/postgresql/schema/user';
import { CreatePostReq } from '@/types/controllers/postReq';
import { CustomRequest } from '@/types/custom';
import { uploadMultiplesToCloudinary, uploadToCloudinary } from '@/utils/cloudinaryHandler';
import { deleteFiles } from '@/utils/deleteFile';
import { errRes } from '@/utils/error';
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
            return errRes(res, 400, "invalid data, userId2 not present");
        }

        if (!req.files) {
            return errRes(res, 400, "invalid request for post create, no media files present");
        }

        if ((Array.isArray(req.files) && req.files.length < 1) || (Object.values(req.files).flat().length < 1)) {
            return errRes(res, 400, "invalid request for post create, no media files present");
        }

        const data: CreatePostReq = req.body;

        if (!data.category) {
            if (req.files) {
                deleteFiles(req.files);
            }
            return errRes(res, 400, "category not present in data");
        }

        const tags: string[] = [];
        if (data.tags) {
            const checkTags: string[] = JSON.parse(data.tags);
            if (!checkTags || checkTags.length < 1) {
                if (req.files) {
                    deleteFiles(req.files);
                }
                return errRes(res, 400, "tags present in req, but invalid data in after parsing");
            }
            tags.concat(checkTags);
        }

        const content: string[] = [];
        if (data.tags) {
            const checkContent: string[] = JSON.parse(data.tags);
            if (!checkContent || checkContent.length < 1) {
                if (req.files) {
                    deleteFiles(req.files);
                }
                return errRes(res, 400, "content present in req, but invalid data in after parsing");
            }
            content.concat(checkContent);
        }

        const files: Express.Multer.File[] = req.files as Express.Multer.File[];
        const checkUpload = files.length;
        const secUrls = await uploadMultiplesToCloudinary(files);

        if (secUrls.length < 1 || checkUpload !== secUrls.length) {
            if (req.file) {
                deleteFiles(req.files);
            }
            return errRes(res, 500, "error while uploading files to cloudinay");
        }

        const test = ["sdfsdef"]

        const newPost = await db.insert(post).values({
            userId: userId2,
            mediaUrls: test, // Assuming secUrls is an array of media URLs
            category: data.category,
        }).returning();

        return res.status(200).json({
            success: true,
            message: "post created",
            post: newPost
        });

    } catch (error) {
        return errRes(res, 500, "error while creating post", error);
    }
};