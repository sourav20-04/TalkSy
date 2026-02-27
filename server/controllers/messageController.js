import { getOrCreateConverSation } from "../lib/getOrCreateConversation.js";
import Conversation from "../models/converstationModel.js";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import { sendToUser } from "../ws/socketManager.js";


// Sidebar Users API (LEFT SIDEBAR)

export const getAllUserForSideBar = async (req,res) => {
    try {
        const userId = req.user._id;

        // getting conversations 

        const conversations = await Conversation.find({
            participants: userId,
            deleteFor: {$nin: userId}
        }).populate("participants", 'name phone')
        .populate('lastMessage').sort({updatedAt:-1});
      
        const users = conversations.map((conv)=>{
            const otherUser = conv.participants.find((p)=>p._id.toString()!== userId.toString())

            return {
                conversationId: conv._id,
                other_id: otherUser._id,
                name: otherUser.name,
                phone: otherUser.phone,
                lastMessage: conv.lastMessage,
                updatedAt: conv.updatedAt
            }
        })

        res.status(200).json({success: true,users})
            
    } catch (error) {
            console.log(error);
          res.status(500).json({ success: false, message: "Sidebar fetch failed" });
    }
}


// Send Message Controller 

export const sendMessage = async (req,res) => {
    try {
        const senderId= req.user._id;
        const {conversationId , text , image} = req.body;
        
        // check the text and image  

        if (!text && !image) {
            return res.status(400).json({success: false , message: "Message cannot be empty"})
        }

        // check the conversations  

        const conversation = await Conversation.findById(conversationId);
        if(!conversation){
            return  res.status(404).json({ message: "Conversation not found" });
        }

        // sequrity check 
      
        if(!conversation.participants.includes(senderId)){
          return res.status(403).json({ message: "Not allowed" });
        }

        // create message 

        const message = await Message.create({
            conversationId,
            senderId,
            text,image
        })

        // update conversation 
        conversation.lastMessage=message._id // stores message id in the lastMessage of the conversation 
      
        const receiverId = conversation.participants.find((id)=>id.toString()!==senderId.toString());

        //REMOVE receiver from deleteFor (if he deleted earlier

        await Conversation.findByIdAndUpdate(conversationId,{
            $pull : {deleteFor: {$in : [senderId,receiverId]} }
        })
    
        await  conversation.save();

            // 🔥 REAL-TIME PART


            sendToUser(receiverId.toString(),{
                type: "new_message",
                conversationId,
                message
            })

        return res.status(200).json({success: true, message})

    } catch (error) {
         console.log(error);
          res.status(500).json({ success: false, message: error.message})
    }
}


// Open chat secrtion 
export const openConversation = async (req,res) => {
  try {
    const userId = req.user._id;
    const {otherUserId} = req.body;              

    if (!otherUserId) {
      return res.status(400).json({ message: "otherUserId required" });
    }

    const conversation = await getOrCreateConverSation(userId,otherUserId);

    res.status(200).json({success: true , conversation});

    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }    
}



//search by mobile number 

export const searchByPhone = async (req,res) => {
    try {
    const {phone} = req.query;

    const user = await User.findOne({phone}).select("_id name phone");

    if(!user){
        return res.status(404).json({message: 'User not found'})
    }

    res.status(200).json({success: true, user})

    } catch (error) {
         res.status(500).json({ message: error.message });
    }
}



// get message section  

export const getMewssgae = async (req,res) => {
    try {
        const {conversationId} = req.params;
        const userId = req.user._id;

        console.log(conversationId);
        

        const conversation = await Conversation.findById(conversationId);

        if(!conversation){
           return res.status(404).json({message: "Conversation not found"})
        }

        if(!conversation.participants.includes(userId)){
         return res.status(403).json({message : "Not allowed"})
        }

        const messages = await Message.find({conversationId}).sort({createdAt: 1})
        
         
        res.status(200).json({success: true, messages})

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



//delete User from sidebar and  Conmversation 

export const deleteConversation = async (req,res) => {
    try {
        const {conversationId} = req.params;
        const userId = req.user._id;
        
        await Conversation.findByIdAndUpdate(conversationId,{
            $addToSet: {deleteFor: userId}
        })

        res.json({success: true, message: 'Chat deleted'})
        
    } catch (error) {
        res.status(500).json({ message: error.message || 'Error deleting chat' });

    }
}



// Mark to seen 
export const markMessageSeen = async (req,res) => {
    try {
        const {conversationId} = req.params;
        const userId = req.user._id;
        await Message.updateMany({
            conversationId,
            senderId: {$ne : userId},
            isRead: false
        },{
            $set: {isRead: true}
        });

        const conversation = await Conversation.findById(conversationId);

        const otherUser = conversation.participants.find((id)=>id.toString()!==userId.toString());

        // sendToUser BY WebScocket

        sendToUser(otherUser.toString(),{
            type: 'conversation_seen',
            conversationId: conversationId,
        })

        res.json({success: true});
    } catch (error) {
          res.status(500).json({ message: error.message });
    }
}