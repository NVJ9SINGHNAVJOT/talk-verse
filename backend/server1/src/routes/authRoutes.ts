import express, { Router } from 'express';
const router: Router = express.Router();

import { signUp } from "@/controllers/auth";
import { imageUpload } from '@/middlewares/fileUpload';

router.post('/signup', signUp);


export default router;
