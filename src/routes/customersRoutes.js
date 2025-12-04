import express from "express";
import { verifyToken, verifyRole } from "../middleware/authMiddleware.js";
import {
  getProfile,
  updateProfile,
  updateProfileImage,
  deleteProfileImage,
  getAllCustomers,
  getCustomerById,
  deleteCustomer,
} from "../controllers/customersController.js";

const customersRouter = express.Router();

// All routes require authentication
customersRouter.use(verifyToken);

// Admin routes
customersRouter.get(
  "/",
  verifyRole("admin"),
  getAllCustomers
);

customersRouter.get(
  "/:id",
  verifyRole("admin"),
  getCustomerById
);

customersRouter.delete(
  "/:id",
  verifyRole("admin"),
  deleteCustomer
);

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

// Profile image routes
customersRouter.patch(
  "/profile/image",
  verifyToken,
  verifyRole("customer"),
  updateProfileImage
);
customersRouter.delete(
  "/profile/image",
  verifyToken,
  verifyRole("customer"),
  deleteProfileImage
);

export default customersRouter;
