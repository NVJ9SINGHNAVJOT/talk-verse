import User from '@/db/mongodb/models/User';
import { UpdateUserDetailsBody } from '@/types/controllers/profileReq';
import { CustomRequest } from '@/types/custom';
import uploadToCloudinary from '@/utils/cloudinaryUpload';
import { errRes } from '@/utils/error';
import { Request, Response } from 'express';
import fs from 'fs';

export const getUserDetails = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = (req as CustomRequest).userId;

        if (!userId) {
            return errRes(res, 400, "invalid data, userId not present");
        }

        const userData = await User.findById({ _id: userId }).select({
            email: true,
            userName: true,
            gender: true,
            contactNumber: true,
            about: true,
            _id: false
        }).exec();

        if (!userData) {
            return errRes(res, 400, 'user profile data not found');
        }

        return res.status(200).json({
            success: true,
            message: 'user profile data',
            userData: userData
        });
    } catch (error) {
        return errRes(res, 500, "error while getting user profile data", error);
    }
};

export const updateProfileImage = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = (req as CustomRequest).userId;

        if (!userId) {
            if (req.file && fs.existsSync(req.file.path)) {
                await fs.promises.unlink(req.file.path);
            }
            return errRes(res, 400, "invalid data, userId not present");
        }

        if (!req.file) {
            return errRes(res, 400, "invalid data, imageFile not present");
        }

        const secUrl = await uploadToCloudinary(req.file);
        if (secUrl === null) {
            if (fs.existsSync(req.file.path)) {
                await fs.promises.unlink(req.file.path);
            }
            return errRes(res, 500, "error while uploading user profile image");
        }

        await User.findByIdAndUpdate({ _id: userId }, { $set: { imageUrl: secUrl } });

        return res.status(200).json({
            success: true,
            message: "user profile image uploaded successfully",
            imageUrl: secUrl
        });
    } catch (error) {
        return errRes(res, 500, "error while uploading user profile image", error);
    }
};

export const updateUserDetails = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = (req as CustomRequest).userId;

        if (!userId) {
            return errRes(res, 400, "invalid data, userId not present");
        }
        const data: UpdateUserDetailsBody = req.body;

        const user = await User.findById({ _id: userId });
        if (user) {
            if (data.bio) {
                user.bio = data.bio;
            }
            if (data.contactNumber) {
                user.contactNumber = data.contactNumber;
            }
            if (data.dateOfBirth) {
                user.dateOfBirth = data.dateOfBirth;
            }
            if (data.gender) {
                user.gender = data.gender;
            }
            // check whether userName exist or not
            if (data.userName) {
                const checkUsers = await User.find({ userName: data.userName });
                if (checkUsers.length === 0) {
                    user.userName = data.userName;
                    await user?.save();
                    return res.status(200).json({
                        success: true,
                        message: 'user details updated successfully'
                    });
                }
                else {
                    await user.save();
                    return res.status(200).json({
                        success: false,
                        message: 'userName is already in use, try again'
                    });
                }
            }

            // userName is not in data for update, so save user
            await user.save();
            return res.status(200).json({
                success: true,
                message: 'user details updated successfully'
            });
        }

        return res.status(400).json({
            success: false,
            message: 'invalid data for user profile update'
        });

    } catch (error) {
        return errRes(res, 500, 'error while updating user details', error);
    }
};