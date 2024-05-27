import {
    acceptRequest, checkOnlineFriends, createGroup, deleteRequest,
    getAllNotifications, getUsers, sendRequest, setOrder,
    setUnseenCount
} from '@/controllers/notification';
import { auth } from '@/middlewares/auth';
import { imageFile } from '@/middlewares/multer';
import express, { Router } from 'express';

const router: Router = express.Router();

router.get('/getUsers', auth, getUsers); // parameters: userName
router.post('/sendRequest', auth, sendRequest);
router.post('/acceptRequest', auth, acceptRequest);
// eslint-disable-next-line drizzle/enforce-delete-with-where
router.delete('/deleteRequest', auth, deleteRequest);
router.get('/getAllNotifications', auth, getAllNotifications);
router.post('/createGroup', imageFile, auth, createGroup);
router.get('/checkOnlineFriends', auth, checkOnlineFriends);
router.post('/setUnseenCount', auth, setUnseenCount);
router.post('/setOrder', auth, setOrder);

export default router;