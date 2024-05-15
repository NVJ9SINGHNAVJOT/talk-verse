import express, { Router } from 'express';
import { imageFile } from '@/middlewares/multer';
import { checkUser, logIn, logOut, signUp } from "@/controllers/auth";

const router: Router = express.Router();

router.post('/signup', imageFile, signUp);
router.post('/login', logIn);
router.get('/checkUser', checkUser);
// eslint-disable-next-line drizzle/enforce-delete-with-where
router.delete('/logout', logOut);

export default router;
