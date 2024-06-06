/* eslint-disable drizzle/enforce-delete-with-where */
import {
  addComment,
  categoryPosts,
  createPost,
  createStory,
  deleteComment,
  deletePost,
  deleteStory,
  followUser,
  getStories,
  recentPosts,
  trendingPosts,
  updateLike,
} from "@/controllers/post";
import { auth } from "@/middlewares/auth";
import { postFiles, storyFile } from "@/middlewares/multer";
import express, { Router } from "express";

const router: Router = express.Router();

router.post("/followUser", auth, followUser); // parameters: userIdToFollow
router.post("/createPost", postFiles, auth, createPost);
router.delete("/deletePost", auth, deletePost); // parameters: postId
router.post("/createStory", storyFile, auth, createStory);
router.delete("/deleteStory", auth, deleteStory); // parameters: storyId
router.post("/updateLike", auth, updateLike); // parameters: postId, update
router.post("/addComment", auth, addComment);
router.delete("/deleteComment", auth, deleteComment); // parameters: commentId
router.get("/getStories", auth, getStories); // parameters: createdAt
router.get("/recentPosts", auth, recentPosts); // parameters: createdAt
router.get("/trendingPosts", auth, trendingPosts); // parameters: createdAt
router.get("/categoryPosts", auth, categoryPosts); // parameters: category, createdAt

export default router;
