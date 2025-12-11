import express from "express";
import { verifyRole, verifyToken } from "../middleware/authMiddleware.js";
import {
  handleWebhook,
  createSubscriptionPayment,
  getProviderSubscriptionStatus,
} from "../controllers/paymentsController.js";

const paymentsRouter = express.Router();

paymentsRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
);

paymentsRouter.post(
  "/subscription-payment",
  verifyToken,
  verifyRole("provider"),
  createSubscriptionPayment
);

paymentsRouter.get(
  "/provider-subscription",
  verifyToken,
  verifyRole("provider"),
  getProviderSubscriptionStatus
);

export default paymentsRouter;
