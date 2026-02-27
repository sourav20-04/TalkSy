import React, { useContext } from 'react' 
import { assets} from '../assets/assets.js'
import ArrowButton from '../reusecomponents/ArrowButton.jsx'
import { ChatContext } from '../context/chatContext.jsx'
import { useState } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'


const LeftSideBar = ({selectedUser,setSelectedUser}) => {
  
const {conversationUser,openConversation,onlineUsers,deleteConverSation} = useContext(ChatContext);

const [contextMenu,setContextMenu]=useState(null);
const menuRef = useRef(null);


const handleOnClick = (user)=>{
   openConversation(user.other_id,user)

    // for mobile screens toggle sidebar
    if (setSelectedUser) {
      setSelectedUser(true);
    }
}


const handleRightClick = (e,user)=>{
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();  // important 

    setContextMenu({
      top: rect.top,
      left: rect.right-150,
      conversationId: user.conversationId,
      user
    });

  console.log("right clicked ");
}



const handleDelete = async()=>{
  if(!contextMenu?.conversationId) return;

  const res = await deleteConverSation(contextMenu.conversationId);

  if(res.success){
    setContextMenu(null)
  }

}

useEffect(()=>{
  const handleClickedOutside=(e)=>{
    if(menuRef.current && !menuRef.current.contains(e.target)){
      setContextMenu(null)
    }
  }
  
  document.addEventListener('click',handleClickedOutside)
  return () =>{
    document.removeEventListener('click',handleClickedOutside)
  }
},[])

  return (
    <div className={`relative h-full text-teal-100  overflow-y-scroll ${selectedUser ? 'max-md:hidden' : ''}`}>

      {/* top logo section  */}

        <div className=' flex items-center justify-between mb-4 py-1'>
            <span className='text-xl font-semibold' >TalkSy</span>
            <img className='w-10 h-6  cursor-pointer' src={assets.menu_icon} alt="" />
        </div>

        {/* chat persons section  */}

        <div className='flex flex-col relative'>
          <div>
             <span >Chat list</span>
          </div>
          
           {conversationUser.map((user,index)=>(
             <div key={index} onClick={()=>handleOnClick(user)}   onContextMenu={(e)=>handleRightClick(e,user)} className='flex  items-center gap-2 p-2 pt-4 rounded-lg transition-colors duration-200 ease-in-out cursor-pointer hover:bg-[#434242]'>
                 <img src={assets.avatar_icon} className='w-[35px] aspect-square rounded-full' alt="" />
                 <div className='flex flex-col leading-5'>
                 <span className='font-sans font-semibold text-[90%]' >{user.name}</span>
                  <span className ={` text-xs ${onlineUsers.includes(user.other_id) ? 'text-green-500': 'text-gray-500'}`}>{onlineUsers.includes(user.other_id)? 'online' : 'ofline'}</span>
                 </div>
             </div>
           ))}
        </div>

        {/* contextmenu ui  */}
        {contextMenu && (
          <div
          ref={menuRef}
           style={{
             position: 'absolute',
             top: contextMenu.top,
             left: contextMenu.left,
           }}
           className='bg-white text-black shadow-lg rounded-md p-2 z-100'
          >
            <div
            className='px-3 w-full py-1 hover:bg-gray-200 cursor-pointer'
            onClick={(e)=>{
              e.stopPropagation();
              handleDelete();
            }}
            >Delete
            </div>

          </div>
        )}

        {/* setting button section  */}
        <div className='flex justify-center mt-3 mb-3 p-2 items-cente'>
            <ArrowButton >
                <img src={assets.setting_Image} className='w-5  invert brightness-0  bg-transparent ' alt="" />
                <span className='text-[18px] font-serif'>Settings</span>
            </ArrowButton>
        </div>


    </div>
  )
}

export default LeftSideBar