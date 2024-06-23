import { sendQuery } from "@/controllers/query";
import express, { Router } from "express";

const router: Router = express.Router();

router.post("/sendQuery", sendQuery);

export default router;
