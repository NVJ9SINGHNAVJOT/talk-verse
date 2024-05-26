import User from '@/db/mongodb/models/User';
import { logger } from '@/logger/logger';
import { UpdateUserDetailsReq } from '@/types/controllers/profileReq';
import { CustomRequest } from '@/types/custom';
import { deleteFromCloudinay, uploadToCloudinary } from '@/utils/cloudinaryHandler';
import deleteFile from '@/utils/deleteFile';
import { errRes } from '@/utils/error';
import valid from '@/validators/validator';
import { Request, Response } from 'express';
import fs from 'fs';

export const checkUserName = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = (req as CustomRequest).userId;

        if (!userId) {
            return errRes(res, 400, "invalid data, userId not present");
        }

        const { userName } = req.query;

        // validation
        if (!userName) {
            return res.status(400).json({
                success: false,
                message: 'invalid username input'
            });
        }

        const checkUserName = await User.countDocuments({ userName: userName });

        if (checkUserName !== 0) {
            return res.status(200).json({
                success: false,
                message: "userName already exits"
            });
        }

        return res.status(200).json({
            success: true,
            message: "userName doesn't exits"
        });

    } catch (error) {
        return errRes(res, 500, "error while checking userName", error);
    }
};

export const getUserDetails = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = (req as CustomRequest).userId;

        if (!userId) {
            return errRes(res, 400, "invalid data, userId not present");
        }

        const userData = await User.findById({ _id: userId }).select({
            email: true,
            userName: true,
            bio: true,
            gender: true,
            countryCode: true,
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
            if (req.file) {
                deleteFile(req.file);
            }
            return errRes(res, 400, "invalid data, userId not present");
        }

        if (!req.file) {
            return errRes(res, 400, "invalid data, imageFile not present");
        }

        const user = await User.findById({ _id: userId }).select({ imageUrl: true });

        if (!user) {
            if (req.file) {
                deleteFile(req.file);
            }
            return errRes(res, 400, 'user not present for profile update');
        }

        const secUrl = await uploadToCloudinary(req.file);
        if (secUrl === null) {
            if (req.file) {
                deleteFile(req.file);
            }
            return errRes(res, 500, "error while uploading user profile image");
        }


        if (user.imageUrl) {
            const publicId = process.env.FOLDER_NAME as string + "/" + user.imageUrl.split('/').pop()?.split('.')[0];
            await deleteFromCloudinay(publicId);
        }

        user.imageUrl = secUrl;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "user profile image uploaded successfully",
            imageUrl: secUrl
        });

    } catch (error) {
        if (req.file) {
            deleteFile(req.file);
        }
        return errRes(res, 500, "error while uploading user profile image", error);
    }
};

export const updateUserDetails = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = (req as CustomRequest).userId;

        if (!userId) {
            return errRes(res, 400, "invalid data, userId not present");
        }
        const data: UpdateUserDetailsReq = req.body;

        const user = await User.findById({ _id: userId }).select({
            email: true,
            userName: true,
            bio: true,
            gender: true,
            countryCode: true,
            contactNumber: true,
            about: true,
        }).exec();

        if (user) {
            if (data.bio) {
                user.bio = data.bio;
            }
            if (data.countryCode) {
                user.countryCode = data.countryCode;
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
                if (!valid.isUserName(data.userName)) {
                    await user?.save();
                    return errRes(res, 400, "userName is invalid for profile update");
                }
                const checkUsers = await User.countDocuments({ userName: data.userName });
                if (checkUsers === 0) {
                    user.userName = data.userName;
                    await user?.save();
                    return res.status(200).json({
                        success: true,
                        message: 'user details updated successfully',
                        userData: user
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
                message: 'user details updated successfully',
                userData: user
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