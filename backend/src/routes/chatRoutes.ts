import { chatBarData, chatMessages, fileMessage, groupMessages } from '@/controllers/chat';
import { auth } from '@/middlewares/auth';
import { imageFile, videoFile } from '@/middlewares/multer';
import express, { Router } from 'express';
const router: Router = express.Router();

router.get('/chatBarData', auth, chatBarData); // parameters: userName
router.get('/chatMessages', auth, chatMessages); // parameters: chatId, createdAt?
router.post('/fileMessage', imageFile, videoFile, auth, fileMessage);
router.get('/groupMessages', auth, groupMessages); // parameters: groupId, createdAt?

export default router;