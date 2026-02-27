import React from 'react'
import { assets, messagesDummyData } from '../assets/assets.js'
import ArrowButton from '../reusecomponents/ArrowButton.jsx'
import { LogOut } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/authContext.jsx';

const RightSideBar = ({selectedUser}) => {
const {logout}=useContext(AuthContext);

  return selectedUser && (
    <div className={`bg-gray-200 flex flex-col items-center justify-between h-full rounded-r-2xl relative overflow-y-scroll  ${selectedUser ? 'max-md:hidden' : ''}`}>
       {/* Name Section  */}
      <div className="profile flex flex-col items-center justify-center gap-2 md:py-25 h-1/4 ">
        <img className='md:w-18 lg:w-25 ' src={assets.avatar_icon} alt="" />
        <span className='name'>{selectedUser}</span>
        <span className='font-sans font-light text-[90%]'>This is the bio here</span>
      </div>

       <hr className=" border-t border-gray-400 dark:border-gray-700" />
        
        {/* file section */}
      <div className="  grid grid-cols-3 grid-rows-2
    gap-2
    h-60
    overflow-y-auto overflow-x-hidden
    place-content-start
    bg-red-200 p-2">
        {
          messagesDummyData.filter(message=>message.image).map((message,index)=>{ 
         return <div key={index} className='w-full h-full aspect-square '>
           <img src={message.image} alt="" className=' block w-full h-full object-cover' />
          </div>
          
         })
        }
      </div>

      {/* button section  */}
        <div className='flex justify-center mt-3  mb-3 p-2 items-center'>
            <ArrowButton onClick={logout} >
                <LogOut />
                <span className='text-[18px] font-serif'>Logout</span>
            </ArrowButton>
        </div>


    </div>
  )
}

export default RightSideBar
