import { getUsers } from '@/controllers/notification';
import { auth } from '@/middlewares/auth';
import express, { Router } from 'express';
const router: Router = express.Router();

router.post('/getUsers', auth, getUsers);

export default router;