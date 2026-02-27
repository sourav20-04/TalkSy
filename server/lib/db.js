import mongoose from "mongoose";

 export const connectDB = async () =>{
   try {
      console.log(process.env.MONGODB_URL);
      mongoose.connection.on("connected",()=>console.log("DataBase connected successfully"));
      await mongoose.connect(`${'mongodb://localhost:27017'||process.env.MONGODB_URL}/TalkSy`);

   } catch (error) {
    console.log(error.message);
    
   }
}