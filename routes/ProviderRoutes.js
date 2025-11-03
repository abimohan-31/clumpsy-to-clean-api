import express from "express";
import {
  createProvider,
  deleteProvider,
  getAllProviders,
  getProviderById,
  updateProvider,
} from "../controllers/ProviderController.js";

const providerRouter = express.Router();

providerRouter.get("/", getAllProviders);
providerRouter.get("/:id", getProviderById);
providerRouter.post("/", createProvider);
providerRouter.put("/:id", updateProvider);
providerRouter.delete("/:id", deleteProvider);

export default providerRouter;
