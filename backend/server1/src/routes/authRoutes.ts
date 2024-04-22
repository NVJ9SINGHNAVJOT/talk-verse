import express, { Router } from 'express';
const router: Router = express.Router();

import { imageFile } from '@/middlewares/multer';
import { logIn, signUp, socket } from "@/controllers/auth";
import { auth } from '@/middlewares/auth';

router.post('/signup', imageFile, signUp);
router.post('/login', logIn);
router.get('/socket', auth, socket);

export default router;
