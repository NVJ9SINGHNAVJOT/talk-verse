import { createPost, userBlogProfile } from '@/controllers/post';
import { auth, auth2 } from '@/middlewares/auth';
import { postFiles, storyFile } from '@/middlewares/multer';
import express, { Router } from 'express';

const router: Router = express.Router();

router.get('/userBlogProfile', auth, auth2, userBlogProfile);
router.post('/createPost', postFiles, auth, auth2, createPost);
router.post('/deletePost', auth, auth2);
router.post('/createStory', storyFile, auth, auth2);
router.post('/deleteStory', auth, auth2);

export default router;