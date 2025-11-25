import { Router } from "express";
import {
  GetProfile,
  Logout,
  RefreshToken,
  ResetPassword,
  SignIn,
  SignUp,
} from "../controller/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const authRouter = Router();

authRouter.post("/sign-in", SignIn);
authRouter.post("/sign-up", SignUp);
authRouter.post("/reset-password", ResetPassword);
authRouter.post("/me", authMiddleware, GetProfile);
authRouter.post("/refresh-token", RefreshToken);
authRouter.post("/logout", authMiddleware, Logout);

export default authRouter;
