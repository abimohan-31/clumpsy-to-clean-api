import express from "express";
import { verifyRole, verifyToken } from "../middleware/authMiddleware.js";
import {
  createWorkPost,
  deleteWorkPost,
  getAllWorkPosts,
  getWorkPostById,
  updateWorkPost,
  getWorkPostsByProvider,
  getWorkPostsByJobPost,
} from "../controllers/workPostsController.js";

const workPostsRouter = express.Router();

workPostsRouter.get(
  "/",
  verifyToken,
  verifyRole(["customer", "provider", "admin"]),
  getAllWorkPosts
);

workPostsRouter.get(
  "/provider/:providerId",
  verifyToken,
  verifyRole(["customer", "provider", "admin"]),
  getWorkPostsByProvider
);

workPostsRouter.get(
  "/job/:jobPostId",
  verifyToken,
  verifyRole(["customer", "provider", "admin"]),
  getWorkPostsByJobPost
);

workPostsRouter.get(
  "/:id",
  verifyToken,
  verifyRole(["customer", "provider", "admin"]),
  getWorkPostById
);

workPostsRouter.post("/", verifyToken, verifyRole("provider"), createWorkPost);

workPostsRouter.put("/:id", verifyToken, verifyRole("provider"), updateWorkPost);

workPostsRouter.delete(
  "/:id",
  verifyToken,
  verifyRole("provider"),
  deleteWorkPost
);

export default workPostsRouter;
