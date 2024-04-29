import express, { Router } from 'express';
const router: Router = express.Router();

import { imageFile } from '@/middlewares/multer';
import { logIn, signUp } from "@/controllers/auth";


router.post('/signup', imageFile, signUp);
router.post('/login', logIn);

export default router;
