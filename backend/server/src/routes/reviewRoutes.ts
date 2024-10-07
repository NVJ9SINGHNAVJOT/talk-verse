import { getReviews, postReview } from "@/controllers/review";
import { auth } from "@/middlewares/auth";
import express, { Router } from "express";

const router: Router = express.Router();

router.post("/postReview", auth, postReview);
router.get("/getReviews", getReviews);

export default router;
