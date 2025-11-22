import express from "express";
import { verifyToken, verifyRole } from "../middleware/authMiddleware.js";
import {
  getProfile,
  updateProfile,
} from "../controllers/customersController.js";
import {
  getAllJobPosts,
  getJobPostById,
  createJobPost,
  updateJobPost,
  approveApplication,
  rejectApplication,
  deleteJobPost,
} from "../controllers/jobPostsController.js";

const customersRouter = express.Router();

// All routes require authentication
customersRouter.use(verifyToken);

// Profile routes
customersRouter.get(
  "/profile",
  verifyToken,
  verifyRole("customer"),
  getProfile
);
customersRouter.put(
  "/profile",
  verifyToken,
  verifyRole("customer"),
  updateProfile
);

// Job Posts routes (customer-owned)
customersRouter.get(
  "/job-posts",
  verifyToken,
  verifyRole(["customer", "provider", "admin"]),
  getAllJobPosts
); // Customers see their own, providers/admin see all
customersRouter.get(
  "/job-posts/:id",
  verifyToken,
  verifyRole("customer", "provider"),
  getJobPostById
);
customersRouter.post(
  "/job-posts",
  verifyToken,
  verifyRole("customer"),
  getJobPostById
);
customersRouter.post(
  "/job-posts",
  verifyToken,
  verifyRole("customer"),
  createJobPost
);
customersRouter.put(
  "/job-posts/:id",
  verifyToken,
  verifyRole("customer"),
  updateJobPost
); // Customer (own) or Admin (any)
customersRouter.put(
  "/job-posts/:id/applications/:applicationId/approve",
  verifyRole("customer"),
  approveApplication
);
customersRouter.put(
  "/job-posts/:id/applications/:applicationId/reject",
  verifyRole("customer"),
  rejectApplication
);
customersRouter.delete("/job-posts/:id", deleteJobPost); // Customer (own) or Admin (any)

export default customersRouter;
