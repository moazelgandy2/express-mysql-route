import express from "express";
import {
  addOrder,
  customersWithoutOrders,
  getAvgOrderValue,
  getCustomersEarliestOrder,
  getCustomersWithFiveOrders,
  getMostPurchased,
  getOrder,
  getRepeatCustomerRate,
  getTopCustomers,
} from "./order.controller.js";

const orderRouter = express.Router();

orderRouter.get("/", getOrder);
orderRouter.get("/avgValue", getAvgOrderValue);
orderRouter.get("/customersWithoutOrders", customersWithoutOrders);
orderRouter.get("/mostPurchased", getMostPurchased);
orderRouter.get("/topCustomers", getTopCustomers);
orderRouter.get("/repeatCustomerRate", getRepeatCustomerRate);
orderRouter.get("/customersEarliestOrder", getCustomersEarliestOrder);
orderRouter.get("/customersWithFiveOrders", getCustomersWithFiveOrders);
orderRouter.post("/", addOrder);

export default orderRouter;
