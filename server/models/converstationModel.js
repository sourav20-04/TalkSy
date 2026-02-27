import mongoose  from "mongoose";

const ConverSationSchema = new mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    deleteFor: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }
},{timestamps: true})

const Conversation = mongoose.model("Conversation",ConverSationSchema)

export default Conversation