import { genarateOtp } from "../utility/genOtp.js";
import User from "../models/userModel.js"
import { Otp } from "../models/otpModel.js";
import CreateToken from "../lib/token.js";



//Function to send otp 
export const sendOtp = async (req,res) => {
    
    try {
      const {phone}=req.body;

      if(!phone) return res.json({success: false, message: "Phone required"});

      let  otp = genarateOtp();
      const otpExpires = Date.now() + 10*60*1000;


      // send sms using provider and i am using now console 
      console.log(otp);

      await Otp.findOneAndUpdate(
        {phone},
         {otp,expireAt: otpExpires},
         {upsert: true});

     
      return res.json({success: true,message: "OTP send"})
          
  } catch (error) {
     console.log(error);
     res.status(500).json({success: false, message: error.message || "Server Error"})
  }

}

 // function to verify otp 

export const verifyOtp = async (req,res) => {
  try {
    const {phone,otp}=req.body;

     const record = await Otp.findOne({phone});

     if(!record) return res.json({success: false,message: "Send  OTP again"});

     if (record?.otp.toString()!==otp.toString()) return res.status(401).json({success: false, message: "Invalid otp"})

     //CHECK EXPIRES 
     if(record.expireAt < Date.now()) return res.json({success: false,message: "OTP Expired"});

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

      return res.json({success: true, message: "logged in", isNewUser: false, token, user: {id: user._id,phone: user.phone , name: user.name}});
     }

     // New user frontend will asks the name next
     
     return res.json({success: true,message: "OTP verifed", isNewUser: true,phone});
     
  } catch (error) {
    console.log(error);
     res.status(500).json({success: false, message: error.message || "Server Error"});
  }   
}



// Name Section for entering it if new its 

export const addName = async (req,res) => {
  try {
   const { phone, name } = req.body;    
    if(!phone || !name)
      return res.json({success: false, message: "Phone and name required"});

    const user = await User.create({ phone, name });
    console.log(user._id);
    

    const token =  CreateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.json({
      success: true,
      message: "User created",
      user: { id: user._id, phone: user.phone, name: user.name }
    });

  } catch (error) {
    console.log(error);
     res.status(500).json({success: false, message: error.message || "Server Error"}); 
  }
}


// check auth and verify the user 

export const getMe = async (req,res) => {
  try {
    
    return res.status(200).json({success: true,user: req.user})
  } catch (error) {
    console.log(error);
     res.status(500).json({success: false, message: error.message || "Server Error"}); 
  }
}


export const logOut = async (req,res) => {
  try {
    res.clearCookie("token",{
      
      httpOnly: true,
      secure: false,     // true in production (HTTPS)
      sameSite: "lax",
    })

    res.status(200).json({success: true,message: "Logged out successfully"})
  } catch (error) {
      console.log(error);
     res.status(500).json({success: false, message: error.message || "Server Error"}); 
  }
  
}