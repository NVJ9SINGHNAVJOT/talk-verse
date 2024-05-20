import express, { Router } from 'express';
import { imageFile } from '@/middlewares/multer';
import { auth } from '@/middlewares/auth';
import { getUserDetails, updateProfileImage, updateUserDetails } from '@/controllers/profile';

const router: Router = express.Router();

router.get('/getDetails', auth, getUserDetails);
router.post('/updateProfileImage', imageFile, auth, updateProfileImage);
router.post('/updateUserDetails', updateUserDetails);

export default router;
