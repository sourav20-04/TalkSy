import { genarateOtp } from "../utility/genOtp.js";
import User from "../models/userModel.js"
import { Otp } from "../models/otpModel.js";
import CreateToken from "../lib/token.js";
import { ApiError } from "../utility/ApiError.js";
import { ApiResponse } from "../utility/ApiResponse.js";



//Function to send otp 
export const sendOtp = async (req,res) => {
    
      const {phone}=req.body;

      if(!phone) throw new ApiError(400,"Phone required");

      let  otp = genarateOtp();
      const otpExpires = Date.now() + 10*60*1000;


      // send sms using provider and i am using now console 
      console.log(otp);

      await Otp.findOneAndUpdate(
        {phone},
         {otp,expireAt: otpExpires},
         {upsert: true});

        res.status(200).json(new ApiResponse(200,"OTP sent"))

}

 // function to verify otp 

export const verifyOtp = async (req,res) => {
  
    const {phone,otp}=req.body;

     const record = await Otp.findOne({phone});

     if(!record) throw new ApiError (404,"Send  OTP again");

     if (record?.otp.toString()!==otp.toString())  throw new ApiError(400,"Invalid otp");

     //CHECK EXPIRES 
     if(record.expireAt < Date.now()) throw new ApiError(401,"OTP Expired");

     await Otp.deleteMany({phone});

     let user = await User.findOne({phone});

     if (user) {
      //Existing user 
      const token = CreateToken(user._id);

        res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });


      const data = {
        isNewUser: false,
        token,
        user:{
          id: user._id,
          phone: user.phone,
          name: user.name
        }
      }

      return res.status(200).json( new ApiResponse(200, "logged in",data));
     }

     // New user frontend will asks the name next
     
     return res.status(200).json( new ApiResponse (200,"OTP verified",{isNewUser:true,phone}));
     
  
}



// Name Section for entering it if new its 

export const addName = async (req,res) => {
   const { phone, name } = req.body;  
   
    if(!phone || !name) throw new ApiError(400,"Phone and name required");

    const user = await User.create({ phone, name });
    console.log(user._id);
    

    const token =  CreateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.status(200).json ( new ApiResponse (200,"User Created" , { id: user._id, phone: user.phone, name: user.name }))
     
  }

// check auth and verify the user 

export const getMe = async (req,res) => {
    
    return res.status(200).json( new ApiResponse(200,"User Fetched",{user:req.user }));
  
}


export const logOut = async (req,res) => {

    res.clearCookie("token",{
      
      httpOnly: true,
      secure: false,     // true in production (HTTPS)
      sameSite: "lax",
    })

    res.status(200).json( new ApiResponse (200,"Logged out successfully"))
 
}