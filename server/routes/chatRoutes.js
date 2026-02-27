import express from 'express';
import { authMiddleWare } from '../middleware/authMiddleware.js';
import { deleteConversation, getAllUserForSideBar, getMewssgae, markMessageSeen, openConversation, searchByPhone, sendMessage } from '../controllers/messageController.js';

const chatRouter = express.Router();
chatRouter.get('/sidebar',authMiddleWare,getAllUserForSideBar)
chatRouter.get('/search',authMiddleWare,searchByPhone)
chatRouter.post('/open',authMiddleWare,openConversation)
chatRouter.post('/send',authMiddleWare,sendMessage);
chatRouter.get('/messages/:conversationId',authMiddleWare,getMewssgae);
chatRouter.delete('/delete/:conversationId',authMiddleWare,deleteConversation);
chatRouter.put('/read/:conversationId',authMiddleWare,markMessageSeen)

export default  chatRouter;