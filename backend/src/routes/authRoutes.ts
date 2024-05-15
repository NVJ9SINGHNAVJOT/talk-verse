import express, { Router } from 'express';
const router: Router = express.Router();

import { imageFile } from '@/middlewares/multer';
import { checkUser, logIn, logOut, signUp } from "@/controllers/auth";
import { auth } from '@/middlewares/auth';

router.post('/signup', imageFile, signUp);
router.post('/login', logIn);
router.get('/checkUser', auth, checkUser);
router.get('/logOut', logOut);

export default router;
