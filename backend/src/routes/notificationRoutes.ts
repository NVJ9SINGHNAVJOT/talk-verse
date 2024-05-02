import { getAllNotifications, getUsers, sendRequest } from '@/controllers/notification';
import { auth } from '@/middlewares/auth';
import express, { Router } from 'express';
const router: Router = express.Router();

router.get('/getUsers', auth, getUsers); // parameters: userName
router.post('/sendRequest', auth, sendRequest);
router.get('/getAllNotifications', auth, getAllNotifications);

export default router;