import express from 'express';
import { addName, getMe, logOut, sendOtp, verifyOtp } from "../controllers/authController.js";
import { authMiddleWare } from '../middleware/authMiddleware.js';


const userRouter= express.Router();
userRouter.post('/send-otp',sendOtp)
userRouter.post('/verify-otp',verifyOtp)
userRouter.post('/add-name',addName);
userRouter.get('/me',authMiddleWare,getMe)
userRouter.post('/logout',logOut)
 

export default userRouter