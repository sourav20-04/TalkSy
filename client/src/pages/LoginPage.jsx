import React, { useState } from "react";
import OTPInput from "../lib/OTPInput.jsx";
import { useContext } from "react";
import { AuthContext } from "../context/authContext.jsx";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [step, setStep] = useState("phone"); // phone → otp → name
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
//   const [isNewUser, setIsNewUser] = useState(false);

const {login,isNewUser} = useContext(AuthContext);

const navigate = useNavigate();


  const handleOtpComplete = (otp)=>{
    setOtp(otp)
 }

 
  const handleNumSubmit = (e)=>{
      e.preventDefault(); 
      login('send-otp',{phone})
       setStep("otp") 
 
  }


 const handleOtpSubmit=(e)=>{
     e.preventDefault();
     login('verify-otp',{phone,otp})
     console.log(otp)

     if(isNewUser==true){
         setStep("name")    
      }
       
      navigate('/')

 }
  

  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <div className="bg-white w-full max-w-md rounded-2xl transition-all duration-300 shadow-xl p-15 sm:p-10">
        <h2 className=" text-2xl sm:text-3xl font-bold text-center text-indigo-600 mb-6">
          {step === "phone" && "TalkSy"}
          {step === "otp" && "Verify OTP 🔐"}
          {step === "name" && "Complete Signup 🎉"}
        </h2>

        {/* phone section  */}
       { step === "phone" &&
        <form onSubmit={handleNumSubmit}  className="flex flex-col gap-5  items-center" action="">
          <span className="font-medium ">Phone Number</span>
          <div className=" flex w-full items-center justify-start px-3 py-2 overflow-hidden rounded-lg border bg-gray-100">
            <select className="bg-transparent outline-none text-gray-700">
              <option value="+91">🇮🇳 +91</option>
            </select>
            <input
              className=" bg-transparent outline-none text-gray-700 placeholder:text-sm placeholder:text-gray-500 "
              placeholder="Enter mobile number"
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g,"").slice(0,10))}
            />
          </div>
          <button type="submit" className="btn-grad cursor-pointer">Send Otp</button>
        </form>
      }
      
      {/* otp section  */}
       {step==="otp" && 
       <form onSubmit={handleOtpSubmit} className="flex flex-col transition-all duration-500 items-center justify-center gap-2 sm:gap-4" action="">
         <span className="font-medium ">OTP</span>
           <OTPInput length={6} onComplete={handleOtpComplete} />
         <button type="submit"  className="btn-grad cursor-pointer">Verify Otp</button>

       </form>  }

       {/* name section */}
    {step==="name" && 
       <form className="flex flex-col transition-all duration-500 items-center justify-center gap-2 sm:gap-4" action="">
            <span className="font-medium ">Full Name</span>
            <input 
            type="text" 
            value={name}
            onChange={(e)=>setName(e.target.value)}
            placeholder="Enter Name"
            className="border bg-gray-100 rounded-lg outline-none
             text-gray-700 text-center py-1 px-1 sm:px-3 sm:py-2 placeholder:text-sm placeholder:text-gray-500 "
            />
         <button className="btn-grad cursor-pointer">Sign Up</button>
       </form>  }
        

      </div>
    </div>
  );
};

export default LoginPage;
