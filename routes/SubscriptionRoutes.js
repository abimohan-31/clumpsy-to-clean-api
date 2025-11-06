import express from "express";
import {
  createSubscription,
  deleteSubscription,
  getAllSubscriptions,
  getSubscriptionById,
  updateSubscription,
} from "../controllers/SubscriptionController.js";

const subscriptionRouter = express.Router();
subscriptionRouter.get("/", getAllSubscriptions);
subscriptionRouter.get("/:id", getSubscriptionById);
subscriptionRouter.post("/", createSubscription);
subscriptionRouter.put("/:id", updateSubscription);
subscriptionRouter.get("/:id", deleteSubscription);

export default subscriptionRouter;
