/* eslint-disable drizzle/enforce-delete-with-where */
import express, { Router } from 'express';
import { imageFile } from '@/middlewares/multer';
import { checkUser, logIn, logOut, sendOtp, signUp } from "@/controllers/auth";

const router: Router = express.Router();

router.post('/signup', imageFile, signUp);
router.post('/sendOtp', sendOtp);
router.post('/login', logIn);
router.get('/checkUser', checkUser);
router.delete('/logout', logOut);

export default router;
