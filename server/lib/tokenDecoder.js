import jwt from'jsonwebtoken';
import '../config.js'

export const tokenDecoder = (token)=>{
   if(!token) return

   const decoded= jwt.verify(token,process.env.JWT_SECRET);
   
    return decoded
}