import React, { useContext, useState } from 'react'
import LeftSideBar from '../components/LeftSideBar.jsx'
import ChatContainer from '../components/ChatContainer.jsx'
import RightSideBar from '../components/RightSideBar.jsx'
import { AuthContext } from '../context/authContext.jsx'

const HomePage = () => {
  const {authUser}= useContext(AuthContext)
  const [selectedUser,setSelectedUser]=useState( null)
 


  return (
    <div className='w-full h-screen p-5 bg-[#2C2C2C]   '>
         <div className={`grid grid-cols-1 h-full relative  ${selectedUser ? 'md:grid-cols-[1fr_2fr_1fr] xl:grid-cols-[1fr_2fr_1fr]' : 'md:grid-cols-2'} `}>

          <LeftSideBar selectedUser={selectedUser} setSelectedUser={setSelectedUser}/>
         { authUser && <ChatContainer selectedUser={selectedUser} setSelectedUser={setSelectedUser} /> }
          <RightSideBar selectedUser={selectedUser}/>
         </div>
    </div>
  )
}

export default HomePage
