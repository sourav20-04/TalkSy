import mongoose  from "mongoose";

 const otpScheema = new mongoose.Schema({
    phone:  {
        type: String,
        required: true
    },
    otp: {
        type: Number,
        required: true,
    },
    expireAt: {
        type: Date,
        required: true,
    },
 })

 //Auto delete functionality of otp if time is reached
 otpScheema.index({expireAt: 1},{expireAfterSeconds: 0});

 export const Otp = mongoose.model("Otp",otpScheema) ;