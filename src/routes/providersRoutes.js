import express from "express";
import {
  verifyToken,
  verifyRole,
  verifyProviderApproval,
} from "../middleware/authMiddleware.js";
import {
  checkApprovalStatus,
  getProfile,
  updateProfile,
  getAllProviders,
  getProviderById,
} from "../controllers/providersController.js";

const providersRouter = express.Router();

// Public routes (no authentication required)
providersRouter.get("/public", getAllProviders);
providersRouter.get("/public/:id", getProviderById);

// Route to check approval status by provider ID (public - no authentication required)
// Allows providers to check their approval status before they can log in
providersRouter.get("/check-approval/:id", checkApprovalStatus);

// Protected routes (require authentication, provider role, and approval)
providersRouter.use(verifyProviderApproval);

// Profile routes (no subscription required)
providersRouter.get(
  "/profile",
  verifyToken,
  verifyRole("provider"),
  getProfile
);
providersRouter.put(
  "/profile",
  verifyToken,
  verifyRole("provider"),
  updateProfile
);

export default providersRouter;
