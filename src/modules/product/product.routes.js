import express from "express";
import { addProduct, getProducts, getTotalRevenue, totalItemsSold } from "./product.controller.js";

const productRouter = express.Router();

productRouter.get("/", getProducts);
productRouter.post("/", addProduct);
productRouter.get("/categoriesRevenue", getTotalRevenue);
productRouter.get("/totalItemsSold", totalItemsSold);
export default productRouter;
