import express, { Router } from 'express';
const router: Router = express.Router();

import { imageFile } from '@/middlewares/multer';
import { signUp } from "@/controllers/auth";

router.post('/signup', imageFile, signUp);

export default router;
