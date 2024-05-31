import express, { Router } from 'express';
import { imageFile } from '@/middlewares/multer';
import { auth } from '@/middlewares/auth';
import { checkUserName, getUserDetails, updateProfile, updateProfileImage } from '@/controllers/profile';

const router: Router = express.Router();

router.get('/checkUserName', auth, checkUserName); // parameters: userName
router.get('/getDetails', auth, getUserDetails);
router.post('/updateProfileImage', imageFile, auth, updateProfileImage);
router.post('/updateProfile', auth, updateProfile);

export default router;
