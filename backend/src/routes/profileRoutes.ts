import express, { Router } from 'express';
import { imageFile } from '@/middlewares/multer';
import { auth } from '@/middlewares/auth';
import { checkUserName, getUserDetails, updateProfileImage, updateUserDetails } from '@/controllers/profile';

const router: Router = express.Router();

router.get('/checkUserName', auth, checkUserName);
router.get('/getDetails', auth, getUserDetails);
router.post('/updateProfileImage', imageFile, auth, updateProfileImage);
router.post('/updateUserDetails', auth, updateUserDetails);

export default router;
