/* eslint-disable drizzle/enforce-delete-with-where */
import {  createPost, createStory, deletePost, deleteStory, updateLike, userBlogProfile } from '@/controllers/post';
import { auth } from '@/middlewares/auth';
import { postFiles, storyFile } from '@/middlewares/multer';
import express, { Router } from 'express';

const router: Router = express.Router();

router.get('/userBlogProfile', auth, userBlogProfile);
router.post('/createPost', postFiles, auth, createPost);
router.delete('/deletePost', auth, deletePost); // parameters: postId
router.post('/createStory', storyFile, auth, createStory);
router.delete('/deleteStory', auth, deleteStory); // parameters: storyId
router.post('/updateLike', auth, updateLike); // parameters: postId, update
router.post('/addComment', auth);
router.delete('/deleteComment', auth);
router.get('/getStories', auth);
router.get('/recentPosts', auth);
router.get('/trendingPosts', auth);
router.get('/categoryPosts', auth); // parameters: category

export default router;