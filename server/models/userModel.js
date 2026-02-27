import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    phone : {type: String, required: true , unique: true},
    name: {type: String,   required: false},
    otp: {type: String , default: null},
    otpExpires: {type: Date, default: null}
},{ timestamps: true })

export default mongoose.model('User',userSchema);