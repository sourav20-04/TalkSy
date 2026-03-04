import jwt from 'jsonwebtoken';
import User from "../models/userModel.js"
import '../config.js'


export const authMiddleWare = async (req,res,next) => {
    try {
        const token = req.cookies.token;

        console.log(token);
        
         
        if(!token){
            return res.status(401).json({success: false,message: "Unauthorized"})
        }

         console.log("SECRET",process.env.JWT_SECRET);
         
        // verify token 
        const decoded= jwt.verify(token,process.env.JWT_SECRET);

        // attach users to request 

        const user = await User.findById(decoded.userId).select("-otp -otpExpires");

        if(!user){
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        req.user = user;
        next();

       
    } catch (error) {
         console.log(error);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
  
}