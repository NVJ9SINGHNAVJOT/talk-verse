import { acceptRequest, checkOnlineFriends, getAllNotifications, getUsers, sendRequest, setOrder, setUnseenCount } from '@/controllers/notification';
import { auth } from '@/middlewares/auth';
import express, { Router } from 'express';
const router: Router = express.Router();

router.get('/getUsers', auth, getUsers); // parameters: userName
router.post('/sendRequest', auth, sendRequest);
router.get('/getAllNotifications', auth, getAllNotifications);
router.post('/acceptRequest', auth, acceptRequest);
router.get('/checkOnlineFriends', auth, checkOnlineFriends);
router.post('/setUnseenCount', auth, setUnseenCount);
router.post('/setOrder', auth, setOrder);

export default router;