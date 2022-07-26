import express from "express";
import {
    signup,
    signin,
    forgotPassword,
    resetPassword
} from './auth.controller'
import { requireSignIn } from './auth.middleware'
export const authRouter = express.Router();

authRouter.post('/signin', requireSignIn, signin);
authRouter.post("/signup", signup);
authRouter.post('/forgotpassword', forgotPassword);
authRouter.post("/resetpassword", resetPassword);
