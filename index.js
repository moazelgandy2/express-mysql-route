import express from "express";
import userRouter from "./src/modules/user/user.routes.js";
import productRouter from "./src/modules/product/product.routes.js";
import orderRouter from "./src/modules/order/order.routes.js";

const app = express();
app.use(express.json());
const port = 8080;

app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/orders", orderRouter);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
