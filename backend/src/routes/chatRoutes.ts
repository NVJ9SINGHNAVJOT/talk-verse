import { chatBarData, chatMessages, createGroup, fileMessage, groupMessages } from '@/controllers/chat';
import { auth } from '@/middlewares/auth';
import { imageFile, videoFile } from '@/middlewares/multer';
import express, { Router } from 'express';
const router: Router = express.Router();

router.get('/chatBarData', auth, chatBarData); // parameters: userName
router.get('/chatMessages', auth, chatMessages); // parameters: chatId, skip
router.post('/fileMessage', imageFile, videoFile, auth, fileMessage);
router.post('/createGroup', imageFile, auth, createGroup);
router.get('/groupMessages', auth, groupMessages); // parameters: groupId, skip

export default router;