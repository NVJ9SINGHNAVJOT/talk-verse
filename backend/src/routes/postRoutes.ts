import { createPost, deletePost, userBlogProfile } from '@/controllers/post';
import { auth } from '@/middlewares/auth';
import { postFiles, storyFile } from '@/middlewares/multer';
import express, { Router } from 'express';

const router: Router = express.Router();

router.get('/userBlogProfile', auth, userBlogProfile);
router.post('/createPost', postFiles, auth, createPost);
router.post('/deletePost', auth, deletePost);
router.post('/createStory', storyFile, auth);
router.post('/deleteStory', auth);

export default router;