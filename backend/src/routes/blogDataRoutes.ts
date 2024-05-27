import { auth, auth2 } from '@/middlewares/auth';
import express, { Router } from 'express';

const router: Router = express.Router();

router.get('/recentPosts', auth, auth2);
router.post('/trendingPosts', auth, auth2);
router.post('/categoryPosts', auth, auth2); // parameters: category
router.post('/updateLike', auth, auth2); // parameters: like
router.post('/addComment', auth, auth2);
router.post('/deleteComment', auth, auth2);

export default router;