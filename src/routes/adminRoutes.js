import express from "express";
import { verifyToken, verifyRole } from "../middleware/authMiddleware.js";
import {
  getAllProviders,
  getPendingProviders,
  getProviderById,
  approveProvider,
  rejectProvider,
  deleteProvider,
  getAllCustomers,
  getCustomerById,
  deleteCustomer,
  getAllAdmins,
  getAllSubscriptions,
  getAllReviews,
  deleteReview,
} from "../controllers/adminsController.js";

const adminRouter = express.Router();

// Apply authentication and admin role verification to all routes
adminRouter.use(verifyToken);
adminRouter.use(verifyRole("admin"));

// Provider management routes
adminRouter.get("/providers/pending", getPendingProviders);
adminRouter.get("/providers/:id", getProviderById);
adminRouter.get("/providers", getAllProviders);
adminRouter.put("/providers/:id/approve", approveProvider);
adminRouter.put("/providers/:id/reject", rejectProvider);
adminRouter.delete("/providers/:id", deleteProvider);

// Customer management routes
adminRouter.get("/customers/:id", getCustomerById);
adminRouter.get("/customers", getAllCustomers);
adminRouter.delete("/customers/:id", deleteCustomer);

// Admin management routes
adminRouter.get("/admins", getAllAdmins);

// Subscription management routes
adminRouter.get("/subscriptions", getAllSubscriptions);

// Review management routes
adminRouter.get("/reviews", getAllReviews);
adminRouter.delete("/reviews/:id", deleteReview);

export default adminRouter;
