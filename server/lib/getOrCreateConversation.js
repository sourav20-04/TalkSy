import Conversation from "../models/converstationModel.js";

export const getOrCreateConverSation = async (userId,otherUserId) => {

    let conversation = await Conversation.findOne({
        participants: {$all: [userId,otherUserId]}
    })
    
    if(!conversation){
        conversation = await Conversation.create({
         participants:  [userId,otherUserId]

        })
    }

    return conversation
} 