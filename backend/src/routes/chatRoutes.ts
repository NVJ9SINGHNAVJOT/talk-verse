import { chatBarData, chatMessages, fileMessage, groupMessages } from '@/controllers/chat';
import { auth } from '@/middlewares/auth';
import { fileMessg } from '@/middlewares/multer';
import express, { Router } from 'express';

const router: Router = express.Router();

router.get('/chatBarData', auth, chatBarData);
router.post('/fileMessage', fileMessg, auth, fileMessage);
router.get('/chatMessages', auth, chatMessages); // parameters: chatId, createdAt
router.get('/groupMessages', auth, groupMessages); // parameters: groupId, createdAt

export default router;