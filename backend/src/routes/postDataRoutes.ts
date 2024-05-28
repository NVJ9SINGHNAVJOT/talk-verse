import { auth } from '@/middlewares/auth';
import express, { Router } from 'express';

const router: Router = express.Router();

router.get('/recentPosts', auth);
router.post('/trendingPosts', auth);
router.post('/categoryPosts', auth); // parameters: category
router.post('/updateLike', auth); // parameters: like
router.post('/addComment', auth);
router.post('/deleteComment', auth);

export default router;