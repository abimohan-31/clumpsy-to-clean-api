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

// Profile routes - MUST be defined before /:id routes to avoid route conflicts
customersRouter.get("/profile", verifyRole("customer"), getProfile);
customersRouter.put("/profile", verifyRole("customer"), updateProfile);

// Profile image routes
customersRouter.patch(
  "/profile/image",
  verifyRole("customer"),
  updateProfileImage
);
customersRouter.delete(
  "/profile/image",
  verifyRole("customer"),
  deleteProfileImage
);

// Admin routes
customersRouter.get("/", verifyRole("admin"), getAllCustomers);

customersRouter.get("/:id", verifyRole("admin"), getCustomerById);

customersRouter.delete("/:id", verifyRole("admin"), deleteCustomer);

export default customersRouter;
