/* eslint-disable drizzle/enforce-delete-with-where */
import { createPost, createStory, deletePost, deleteStory, userBlogProfile } from '@/controllers/post';
import { auth } from '@/middlewares/auth';
import { postFiles, storyFile } from '@/middlewares/multer';
import express, { Router } from 'express';

const router: Router = express.Router();

router.get('/userBlogProfile', auth, userBlogProfile);
router.post('/createPost', postFiles, auth, createPost);
router.delete('/deletePost', auth, deletePost); // parameters: postId
router.post('/createStory', storyFile, auth, createStory);
router.delete('/deleteStory', auth, deleteStory); // parameters: storyId

export default router;