import { Router } from "express";
import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from "../controller/todoController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const todoRouter = Router();

todoRouter.get("/", authMiddleware, getTodos);
todoRouter.post("/", authMiddleware, addTodo);
todoRouter.patch("/:id", authMiddleware, updateTodo);
todoRouter.delete("/:id", authMiddleware, deleteTodo);

export default todoRouter;
