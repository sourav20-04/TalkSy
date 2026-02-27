import React, { useContext, useEffect, useRef, useState } from "react";
import { assets } from "../assets/assets.js";
import { Mic, Paperclip, Camera, Smile, SendHorizontal } from "lucide-react";
import { ChatContext } from "../context/chatContext.jsx";
import { AuthContext } from "../context/authContext.jsx";

const ChatContainer = ({selectedUser}) => {
  const { authUser } = useContext(AuthContext);
  const { messages,onlineUsers, openUser,otherUserId,sendMessages, activeConverSationUser } = useContext(ChatContext);

console.log("auth User" , authUser)
console.log("active",activeConverSationUser)
console.log("Selected for open the chat",selectedUser)

  

  const [inputMsg, setInputMsg] = useState("");
  
  const [selectedFile, setSelectedFile] = useState(null);


  const isOnline = onlineUsers.includes(otherUserId);


  const handleSendMessage = () => {
  if (!activeConverSationUser?._id || !inputMsg.trim()) return;

  sendMessages({
    text: inputMsg,
    conversationId: activeConverSationUser._id,
    image: selectedFile,
  });

  setInputMsg("");
};


  useEffect(() => {
    scrollEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeConverSationUser, activeConverSationUser]);


  const scrollEnd = useRef();


  return selectedUser ? (
    <div className="bg-back-primary grid grid-rows-[0.5fr_2fr_0.3fr] text-[#132440] h-full transition-all transform-view overflow-scroll backdrop-blur-lg pb-1  rounded-l-2xl">
      <div className="flex py-3 sticky top-0 right-0 left-0 z-10 bg-back-primary border-b border-gray-400 dark:border-gray-700  items-center justify-center gap-5">
        <img src={assets.avatar_icon} className="avatar" alt="" />
        <span className="name">{openUser?.name}</span>
        <div className="flex items-center gap-1.5">
        <div className={`online-status ${isOnline ? 'bg-green-500': 'bg-gray-400'}`}></div>
          <span className={`font-sans font-thin`}>{isOnline ? 'Online' : 'Ofline'}</span>
        </div>
      </div>

      {/* message ssection  */}

      <div className="flex flex-col grow transition-all  p-3 ">
        {messages.map((message, index) => {
         
            const isMe = message.senderId!==otherUserId || message.senderId ===authUser._id ;           
            console.log(message)
            

          console.log("is it me" ,isMe,authUser._id);
          
          return (
            <div
              key={index}
              className={`flex gap-2 items-end justify-end   ${
                isMe ? " " : "flex-row-reverse"
              }`}
            >

              {/* ONLY IMAGE  */}
              {message.image && !message.text && (
                <img
                  src={message.image}
                  className="max-w-60 md:max-w-40 lg:max-w-60 border border-gray-400 rounded-lg overflow-hidden mb-8"
                  alt=""
                />
              )}

              {/* ONLY TEXT */}
              {!message.image && message.text && (
                <p
                  className={`px-4 py-2 max-w-50  md:text-sm  lg:max-w-full font-light  font-sans mb-8  break-all rounded-lg ${
                    isMe
                    ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-300 text-gray-600 rounded-bl-none"
                  } `}
                >
                  {message.text}
                </p>
              )}

              {isMe && (
                <div className="text-[10px] text-right mt-1">
                  {message.isRead ? 'Seen' : 'Delivered'}
                </div>
              )}

            </div>  // return div
          );
        })}
        <div ref={scrollEnd}></div>
      </div>

      {/* buttom area  */}

      <div className="flex items-center justify-between sticky left-0 bottom-0 z-10 gap-1 sm:gap-2  border-2 border-gray-300 rounded-lg bg-gray-200   sm:px-4 py-2 sm:mx-2">
        <div>
          <Mic className="w-4 ml-1 sm:w-5 md:w-6 cursor-pointer" />
        </div>

        <div className=" w-full px-1 sm:px-3 lg:px-4">
          <textarea
            className="w-full outline-none text-gray-700 font-light font-serif"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            onChange={(e) => setInputMsg(e.target.value)}
            value={inputMsg}
            type="text"
            placeholder="Write your message!"
          />
        </div>
        <div className="flex gap-1 sm:gap-2 md:gap-2 cursor-pointer">
          <Paperclip className="w-4 sm:w-5 md:w-6 cursor-pointer" />
          <Camera className="w-4 sm:w-5 md:w-6 cursor-pointer" />
          <Smile className="w-4 sm:w-5 md:w-6 cursor-pointer" />
          <SendHorizontal
            onClick={handleSendMessage}
            className="w-4.5 sm:w-5 md:w-6 cursor-pointer"
          />
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center max-md:hidden gap-2 text-gray-500 bg-white/10 ">
      <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatContainer;
