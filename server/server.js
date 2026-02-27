import './config.js'
import express from 'express'
import http from 'http'
import { connectDB } from './lib/db.js';
import userRouter from './routes/authRotes.js';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import chatRouter from './routes/chatRoutes.js';
import { WebSocketServer } from 'ws';
import { setupWebSocket } from './ws/socketManager.js';




const app= express();
const server = http.createServer(app);

// attach  row websocket to server

const wss = new WebSocketServer({server});

// connected to the websocket 
setupWebSocket(wss)





//Middleware setUp 
app.use(express.json())

app.use(cookieParser());

app.use(
   cors({
     origin: process.env.CLIENT_URL,
     credentials: true
   })
)

console.log(process.env.CLIENT_URL)

app.use('/api/status' , (req,res)=>res.send("Server is running "));

app.use('/api/auth',userRouter);

app.use('/api/chat',chatRouter);



// database connection 
 await connectDB();


const PORT =    process.env.PORT || 5000 ;

server.listen(PORT,'0.0.0.0',()=>console.log(`Server is running on ${PORT}`))