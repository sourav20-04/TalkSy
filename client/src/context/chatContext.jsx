import { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api.js";
import { AuthContext } from "./authContext.jsx";
import { useRef } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { authUser , loadingAuth } = useContext(AuthContext);

  const [conversationUser, setConversationUser] = useState([]);
  const [otherUserId, setOtherUserId] = useState(null);
  const [onlineUsers,setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeConverSationUser, setActiveConverSationUser] = useState(null);
  const [openUser,SetOpenUser]= useState(null);
  
  
  const wsRef = useRef(null);
  const activeConversationRef= useRef(null);


  useEffect(() => {
    activeConversationRef.current = activeConverSationUser;
  }, [activeConverSationUser]);



  // left side bar
  useEffect(() => {
    if (loadingAuth) return; 
    if (!authUser) return;

    const getUsers = async () => {
      try {
        const { data } = await api.get("/api/chat/sidebar");

        if (data.success) {
          setConversationUser(data.users);
        }
      } catch (err) {
        console.log(err.response?.data || err.message);
      }
    };

    getUsers();
  }, [authUser,loadingAuth]);





  //Open conversation
  const openConversation = async (otherUserId,userData) => {
        if (!authUser) return;

    try {
      const { data } = await api.post("/api/chat/open", {
        otherUserId,
      });

      setOtherUserId(otherUserId)

      if (data.success) {
        const conversation = data.conversation;
        setActiveConverSationUser(conversation)
        SetOpenUser(userData)
        getMessage(conversation._id);

      }
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };




  // getMEssage section

      const getMessage = async (conversationId) => {
        
        try {
        const { data } = await api.get(`/api/chat/messages/${conversationId}`);

        if (data.success) {
          setMessages(data.messages);
        }


      } catch (err) {
        console.log(err.response?.data || err.message);
      }
    };


    
    useEffect(() => {

        if (!authUser) {
    // 👇 logout happened
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    return;
  }


  const ws = new WebSocket("ws://localhost:3000");
  wsRef.current = ws;
   
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === "new_message" ){
      if(data.conversationId=== activeConversationRef.current?._id){
        setMessages(prev => [...prev, data.message])
        // mark as read instantly if chat is open
           api.put(`/api/chat/read/${data.conversationId}`);

      }


      if(activeConverSationUser?._id===data.conversationId){
           api.put(`/api/chat/read/${data.conversationId}`)

      }
    }

    if(data.type==="ONLINE_USERS"){
        setOnlineUsers(data.users);
    }

    if(data.type==='conversation_seen'){
      setMessages(prev=>prev.map(msg=>msg.conversationId===data.conversationId ? {...msg, isRead: true}: msg))
    }
  }

  return () => ws.close()
}, [ authUser])





// === fetch messages on conversation change ===
useEffect(() => {
  if (activeConverSationUser?._id) {
    getMessage(activeConverSationUser._id);

      // 🐞 BUG FIX: mark as read only when conversation opens
      api.put(`/api/chat/read/${activeConverSationUser._id}`);

  }
}, [activeConverSationUser]);




  // Send Messages and action
  const sendMessages = async ({ text, conversationId, image }) => {
    try {
      const { data } = await api.post(`/api/chat/send`, {
        text,
        conversationId,
        image,
      });

      if (data.success) {
        setMessages((prev) => [...prev, data.message]);
      }

      console.log("Sent messages", data);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  // Delete Function 

  const deleteConverSation = async (conversationId) => {
    try {
      const {data} = await api.delete(`/api/chat/delete/${conversationId}`);
      
      if(data.success){
        setConversationUser((prev)=>prev.filter((conv)=>conv.conversationId!==conversationId))
      }

      // if deleted chat is open clear it 
      if(activeConverSationUser?._id===conversationId){
        setActiveConverSationUser(null)
        setMessages([])
      }  
      
       return data
    } catch (err) {
        console.log(err.response?.data || err.message);
    }
  }




  const value = {
    conversationUser,
    messages,
    activeConverSationUser,
    otherUserId,
    onlineUsers,
    openUser,

    openConversation,
    sendMessages,
    deleteConverSation
      };




  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
