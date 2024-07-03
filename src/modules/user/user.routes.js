import express from "express";
import { getUsers, signUp, signIn } from "./user.controller.js";

const userRouter = express.Router();

userRouter.get("/", getUsers);
userRouter.post("/signup", signUp);
userRouter.post("/signin", signIn);

export default userRouter;
