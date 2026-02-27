import cookie from 'cookie';
import { tokenDecoder } from '../lib/tokenDecoder.js';
import {WebSocket} from 'ws';

const onlineUsers = new Map ();


export const setupWebSocket = (wss)=>{
    wss.on('connection',(ws,req)=>{
    try {
       const cookies = cookie.parse(req.headers.cookie || "");
       const token = cookies.token;

       if(!token){
        ws.close();
        return 
       }

       const decoded = tokenDecoder(token);

       ws.userId=decoded.userId;
       
       // add user to online map 
       onlineUsers.set(ws.userId,ws)

       console.log("WS connected:", ws.userId)

      //  Broadcast updated online list 
      broadcastOnlineUsers();

       ws.on('message',(data)=>{
          handleMessages(ws,data)
       })


       ws.on('close',()=>{
         onlineUsers.delete(ws.userId);
         console.log('Ws disconnected',ws.userId);
         // Broadcast update list online 
          broadcastOnlineUsers()
       })

        

    }catch{
      ws.close()
    }

    })
}


export const sendToUser = (userId,payload)=>{
    const ws = onlineUsers.get(userId)

    if (ws && ws.readyState === WebSocket.OPEN){
        ws.send(JSON.stringify(payload))
    }
}


const broadcastOnlineUsers = ()=>{
  //making an array from keys of online users 
  const onlineUsersIds = Array.from(onlineUsers.keys());

  const payload  = JSON.stringify({
     type: "ONLINE_USERS",
     users: onlineUsersIds,
  })

  onlineUsers.forEach((client)=>{
    if (client.readyState===WebSocket.OPEN) {
      client.send(payload)
    }
  })

}