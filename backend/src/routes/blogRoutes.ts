import { userBlogProfile } from '@/controllers/blog';
import { auth, auth2 } from '@/middlewares/auth';
import { blogFiles, storyFile } from '@/middlewares/multer';
import express, { Router } from 'express';

const router: Router = express.Router();

router.get('/userBlogProfile', auth, auth2, userBlogProfile);
router.post('/createBlog', blogFiles, auth, auth2);
router.post('/deleteBlog', auth, auth2);
router.post('/createStory', storyFile, auth, auth2);
router.post('/deleteStory', auth, auth2);

export default router;