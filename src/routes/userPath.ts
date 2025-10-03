import { signin, login, getAllUsers, logout, forgotPassword, resetPassword, verifyEmail, resendVerification } from "../controllers/userController";
import express from "express";

const userRouter = express();

userRouter.post("/userRegistration", signin);

userRouter.post("/userLogin",login)

userRouter.get("/getAllUsers",getAllUsers)
userRouter.post("/userLogout", logout)
userRouter.post("/forgot-password", forgotPassword)
userRouter.post("/reset-password", resetPassword)
userRouter.post("/verify-email", verifyEmail)
userRouter.post("/resend-verification", resendVerification)



export default userRouter;
