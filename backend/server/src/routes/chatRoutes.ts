import { chatBarData, chatMessages, fileMessage, groupMembers, groupMessages } from "@/controllers/chat";
import { auth } from "@/middlewares/auth";
import { fileMessg } from "@/middlewares/multer";
import express, { Router } from "express";

const router: Router = express.Router();

router.get("/chatBarData", auth, chatBarData);
router.post("/fileMessage", fileMessg, auth, fileMessage);
router.get("/chatMessages", auth, chatMessages); // parameters: chatId, createdAt
router.get("/groupMessages", auth, groupMessages); // parameters: groupId, createdAt
router.get("/groupMembers", auth, groupMembers); // parameters: groupId

export default router;
