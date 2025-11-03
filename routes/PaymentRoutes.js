import express from "express";
import {
  createPayment,
  deletePayment,
  getAllPayments,
  getPaymentById,
  updatePayment,
} from "../controllers/PaymentController.js";

const paymentRouter = express.Router();
paymentRouter.get("/", getAllPayments);
paymentRouter.get("/:id", getPaymentById);
paymentRouter.post("/", createPayment);
paymentRouter.put("/:id", updatePayment);
paymentRouter.get("/:id", deletePayment);

export default paymentRouter;
