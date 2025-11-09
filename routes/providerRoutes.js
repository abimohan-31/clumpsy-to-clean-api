import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authorizeMiddleware.js";
import { checkProviderApproval } from "../middleware/providerApprovalMiddleware.js";
import { checkSubscription } from "../middleware/subscriptionMiddleware.js";
import {
  getProviderProfile,
  updateProviderProfile,
  getProviderSubscription,
  getProviderBookings,
  getProviderReviews,
  createReview,
  getAllProviders,
  getProviderById,
} from "../controllers/ProviderController.js";

const providerRouter = express.Router();

// Public routes (no authentication required)
providerRouter.get("/public", getAllProviders);
providerRouter.get("/public/:id", getProviderById);

// Protected routes (require authentication, provider role, and approval)
providerRouter.use(authenticate);
providerRouter.use(authorize("provider"));
providerRouter.use(checkProviderApproval);

// Profile routes
providerRouter.get("/profile", getProviderProfile);
providerRouter.put("/profile", updateProviderProfile);

// Subscription routes (require active subscription)
providerRouter.get("/subscription", getProviderSubscription);

// Booking routes (require active subscription for some features)
providerRouter.get("/bookings", checkSubscription, getProviderBookings);

// Review/Feedback routes (require active subscription)
providerRouter.get("/reviews", checkSubscription, getProviderReviews);
providerRouter.post("/reviews", checkSubscription, createReview);

export default providerRouter;

