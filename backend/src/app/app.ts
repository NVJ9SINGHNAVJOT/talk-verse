import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import serverKey from "@/middlewares/serverKey";
import authRoutes from "@/routes/authRoutes";
import notificationRoutes from "@/routes/notificationRoutes";
import chatRoutes from "@/routes/chatRoutes";
import profileRoutes from "@/routes/profileRoutes";
import postRoutes from "@/routes/postRoutes";
import queryRoutes from "@/routes/queryRoutes";
import reviewRoutes from "@/routes/reviewRoutes";
import logging from "@/middlewares/logging";
import { origins } from "@/config/corsOptions";

const app = express();

app.use(
  cors({
    origin: origins,
    credentials: true,
    methods: ["PUT", "PATCH", "POST", "GET", "DELETE"],
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// logging details
app.use(logging);

// server only accessible with serverKey
app.use(serverKey);

// routes
app.use("/api/v1/auths", authRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/chats", chatRoutes);
app.use("/api/v1/profiles", profileRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/queries", queryRoutes);
app.use("/api/v1/reviews", reviewRoutes);

app.get("/", (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: "server is up and running.",
  });
});

export default app;
