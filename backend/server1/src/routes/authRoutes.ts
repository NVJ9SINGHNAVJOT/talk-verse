import express, { Router } from 'express';
const router: Router = express.Router();

import { signUp } from "@/controllers/auth";

router.post('/signup', signUp);


export default router;
