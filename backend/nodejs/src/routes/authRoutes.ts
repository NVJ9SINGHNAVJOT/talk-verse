/* eslint-disable drizzle/enforce-delete-with-where */
import express, { Router } from "express";
import { imageFile } from "@/middlewares/multer";
import {
  changePassword,
  checkUser,
  logIn,
  logOut,
  sendOtp,
  resetPassword,
  signUp,
  verifyOtp,
} from "@/controllers/auth";
import { auth } from "@/middlewares/auth";

const router: Router = express.Router();

router.post("/signup", imageFile, signUp);
router.post("/sendOtp", sendOtp);
router.post("/login", logIn);
router.get("/checkUser", checkUser);
router.delete("/logout", logOut);
router.post("/changePassword", auth, changePassword);
router.put("/verifyOtp", verifyOtp);
router.post("/resetPassword", resetPassword);

export default router;
