import express from "express";
import { verifyToken, verifyRole } from "../middleware/authMiddleware.js";
import {
  getAllSubscriptions,
  getSubscriptionById,
  createSubscription,
  updateSubscription,
  deleteSubscription,
} from "../controllers/subscriptionsController.js";

const subscriptionsRouter = express.Router();

// All routes require authentication
subscriptionsRouter.use(verifyToken);

// GET routes
// Admin: Can view all subscriptions
// Provider: Can view only their own subscriptions (filtered in controller)
subscriptionsRouter.get("/", verifyRole("admin", "provider"), getAllSubscriptions);
subscriptionsRouter.get("/:id", verifyRole("admin", "provider"), getSubscriptionById);

// POST, PUT, DELETE routes (admin only)
subscriptionsRouter.post("/", verifyRole("admin"), createSubscription);

// Provider self-subscription route
subscriptionsRouter.post("/provider/subscribe", verifyRole("provider"), async (req, res, next) => {
  const { createProviderSubscription } = await import("../controllers/subscriptionsController.js");
  return createProviderSubscription(req, res, next);
});

subscriptionsRouter.put("/:id", verifyRole("admin"), updateSubscription);
subscriptionsRouter.delete("/:id", verifyRole("admin"), deleteSubscription);

export default subscriptionsRouter;
