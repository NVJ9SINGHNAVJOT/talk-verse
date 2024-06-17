/* eslint-disable drizzle/enforce-delete-with-where */
import express, { Router } from "express";
import { imageFile } from "@/middlewares/multer";
import { auth } from "@/middlewares/auth";
import {
  checkUserName,
  getUserDetails,
  removeFollower,
  unfollowUser,
  updateProfile,
  updateProfileImage,
  userBlogProfile,
  userFollowers,
  userFollowing,
  userPosts,
} from "@/controllers/profile";

const router: Router = express.Router();

router.get("/checkUserName", auth, checkUserName); // parameters: userName
router.get("/getDetails", auth, getUserDetails);
router.post("/updateProfileImage", imageFile, auth, updateProfileImage);
router.post("/updateProfile", auth, updateProfile);
router.get("/userBlogProfile", auth, userBlogProfile);
router.get("/userPosts", auth, userPosts);
router.get("/userFollowing", auth, userFollowing);
router.get("/userFollowers", auth, userFollowers);
router.delete("/removeFollower", auth, removeFollower);
router.delete("/unfollowUser", auth, unfollowUser);

export default router;
