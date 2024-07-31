/* eslint-disable drizzle/enforce-delete-with-where */
import {
  acceptFollowRequest,
  acceptRequest,
  addUsersInGroup,
  checkOnlineFriends,
  createGroup,
  deleteFollowRequest,
  deleteRequest,
  followRequests,
  followSuggestions,
  getAllNotifications,
  getFollowUsers,
  getUsers,
  sendFollowRequest,
  sendRequest,
  setOrder,
  setUnseenCount,
} from "@/controllers/notification";
import { auth } from "@/middlewares/auth";
import { imageFile } from "@/middlewares/multer";
import express, { Router } from "express";

const router: Router = express.Router();

router.get("/getUsers", auth, getUsers); // parameters: userName
router.get("/getFollowUsers", auth, getFollowUsers); // parameters: userName
router.post("/sendRequest", auth, sendRequest);
router.post("/acceptRequest", auth, acceptRequest);
router.delete("/deleteRequest", auth, deleteRequest);
router.get("/getAllNotifications", auth, getAllNotifications);
router.post("/createGroup", imageFile, auth, createGroup);
router.post("/addUsersInGroup", auth, addUsersInGroup);
router.get("/checkOnlineFriends", auth, checkOnlineFriends);
router.post("/setUnseenCount", auth, setUnseenCount);
router.post("/setOrder", auth, setOrder);
router.post("/sendFollowRequest", auth, sendFollowRequest);
router.delete("/deleteFollowRequest", auth, deleteFollowRequest);
router.post("/acceptFollowRequest", auth, acceptFollowRequest);
router.get("/followRequests", auth, followRequests), router.get("/followSuggestions", auth, followSuggestions);

export default router;
