import { chatBarData } from '@/controllers/chat';
import { auth } from '@/middlewares/auth';
import express, { Router } from 'express';
const router: Router = express.Router();

router.get('/chatBarData', auth, chatBarData); // parameters: userName
router.get('/chatMessages', auth, chatMessages); // parameters: userName


export default router;