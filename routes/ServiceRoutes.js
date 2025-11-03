import express from "express";
import {
  createService,
  deleteService,
  getAllServices,
  getServiceById,
  updateService,
} from "../controllers/ServiceController.js";

const serviceRouter = express.Router();

serviceRouter.get("/", getAllServices);
serviceRouter.get("/:id", getServiceById);
serviceRouter.post("/", createService);
serviceRouter.put("/", updateService);
serviceRouter.delete("/", deleteService);

export default serviceRouter;
