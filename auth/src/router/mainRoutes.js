import express from "express";
import authRouter from "./authRoute.js";
import todoRouter from "./todoRoute.js";

const mainRouter = express();

mainRouter.use("/auth", authRouter);
mainRouter.use("/todo", todoRouter);

export default mainRouter;
