import express from "express";
import { verifyToken, verifyRole } from "../middleware/authMiddleware.js";
import {
  getAllServices,
  getAllCategories,
  getServicesByCategory,
  getServiceById,
  getProvidersByService,
} from "../controllers/servicesController.js";

const servicesRouter = express.Router();

// Public routes (no authentication required)
servicesRouter.get("/", getAllServices);
servicesRouter.get("/categories", getAllCategories);
servicesRouter.get("/categories/:category", getServicesByCategory);
servicesRouter.get("/:id", getServiceById);

export default servicesRouter;
