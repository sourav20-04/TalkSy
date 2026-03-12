import express from 'express';
import { addName, getMe, logOut, sendOtp, verifyOtp } from "../controllers/authController.js";
import { authMiddleWare } from '../middleware/authMiddleware.js';
import { limiter } from '../lib/rateLimmiter.js';
import AsyncHandler from '../utility/AsyncHandler.js';


const userRouter= express.Router();
userRouter.post('/send-otp',AsyncHandler(sendOtp))
userRouter.post('/verify-otp',AsyncHandler(verifyOtp))
userRouter.post('/add-name',AsyncHandler(addName));
userRouter.get('/me',authMiddleWare,AsyncHandler(getMe))
userRouter.post('/logout',AsyncHandler(logOut))
 

export default userRouter