import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import dp from "../assets/dp.webp"
import { IoSearch } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { CiLogout } from "react-icons/ci";
import { serverurl } from '../config';
import axios from 'axios';
import { setOtherUsers, setSelectedUser, setUserData } from '../redux/userSlice';
import { useNavigate } from "react-router-dom";


function Sidebar() {
    const {userData,otherUser,selectedUser,onlineUsers}=useSelector(state=>state.user)
    const[search, setSearch]=useState(false)

    const dispatch=useDispatch()
    const navigate=useNavigate()

    const handleLogout=async()=>{
      try {
        const result=await axios.get(`${serverurl}/api/v2/auth/logout`,{withCredentials:true})
        dispatch(setUserData(null))
        dispatch(setOtherUsers(null))
        navigate("/login")
      } catch (error) {
        console.log("Error in handleLogout",error);
      }
    }

  return (
    <div className={`lg:w-[30%] w-full h-full overflow-hidden lg:block bg-white lg:block ${!selectedUser?"block":"hidden"}`}>

      {/* logout */}
      <div>
         <div className='w-[50px] h-[50px] rounded-full !bg-red-400 overflow-hidden flex justify-center items-center shadow-gray-400 shadow-lg  cursor-pointer fixed bottom-[15px] left-[20px]' onClick={handleLogout}>
            <CiLogout className='w-[25px] h-[25px]'/>
          </div>
      </div>
      <div className='w-full h-[400px] bg-[#20c7ff] rounded-b-[30%] shadow-lg shadow-gray-400 flex flex-col gap-[20px] px-[20px] py-[70px] gap-[20px]'>
      <h1 className='text-white font-bold text-[19px]'>ChitChat</h1>
        <div className='w-full flex justify-between items-center font-bold text-[12px]'>
          <h1>Hi, {userData.name || "user"}</h1>
           <div className='w-[80px] h-[80px] rounded-full overflow-hidden flex justify-center items-center shadow-gray-400 shadow-lg cursor-pointer' onClick={()=>navigate("/profile")}>
              <img src={userData.image || dp} alt="" className='w-full h-full object-cover object-top'/>
           </div>
        </div>

        <div className='w-full flex items-center gap-[20px]'>
           {!search &&
              <div className='w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center shadow-gray-400 shadow-lg bg-white cursor-pointer mb-4' onClick={()=>setSearch(true)}>
              <IoSearch className='w-[25px] h-[25px]'/>
              </div>
        }
        {search && 
            <form className='w-screen h-[50px] bg-white shadow-gray-400 shadow-lg flex items-center gap-[10px] rounded-full'>
             <IoSearch className='w-[30px] h-[30px] ml-3'/>
             <input type="text" placeholder='search user...' className='w-full h-full outline-0 border-0 text-[20px] font-semibold'/>
             <RxCross2 className='w-[30px] h-[30px] cursor-pointer mr-5' onClick={()=>setSearch(false)}/>
            </form>
        }

        <div className="w-full overflow-hidden ml-5 gap-[40px] hide-scrollbar">
          <div className="relative">
            <div className="flex gap-[30px] overflow-x-auto snap-x snap-mandatory py-2 no-scrollbar ">
             {!search &&
  otherUser?.map((user) => (
    onlineUsers?.includes(user._id) &&
    <div
      key={user?._id}
      className="flex flex-col items-center justify-center gap-2 flex-shrink-0 snap-start w-[70px] mt-2"
      onClick={()=>dispatch(setSelectedUser(user))}
    >
      {/* Wrapper allows dot positioning outside image */}
      <div className="relative w-[60px] h-[60px] flex justify-center items-center">
        
        {/* Circular image */}
        <div className="w-full h-full rounded-full overflow-hidden shadow-gray-400 shadow-lg border-2 border-[#20c7ff]">
          <img
            src={user.image || dp}
            alt={user?.name || user?.username}
            className="w-full h-full object-cover object-top"
          />
        </div>

        {/* ✅ Online Status Dot — bottom-right position */}
        {onlineUsers?.includes(user._id) && (
          <div className="absolute bottom-0 right-0 w-[16px] h-[16px] bg-green-500 border-2 border-white rounded-full shadow-md"></div>
        )}
      </div>

      {/* Username */}
      <div className="text-[12px] text-gray-700 font-medium text-center truncate w-[70px]">
        {user?.name || user?.username}
      </div>
    </div>
  ))}


    

            </div>

    {/* thin gray line at bottom */}
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#20c7ff] rounded-full" />
           </div>
        </div>
       </div>      

      </div>

      <div className='w-full h-[50vh] overflow-auto flex flex-col hide-scrollbar gap-[15px] px-2 mt-4 mb-4 py-3 bg-white'>
      {otherUser?.map((user) => (
        <div key={user?._id} className='w-full h-[70px] flex items-center gap-[15px] bg-gray-100 rounded-2xl shadow-md hover:shadow-lg px-4 py-2 cursor-pointer transition-all duration-200 hover:bg-blue-300' onClick={()=>dispatch(setSelectedUser(user))}>
      {/* Profile Image */}
      <div className='w-[50px] h-[50px] rounded-full overflow-hidden flex justify-center items-center shadow-sm'>
        <img
          src={user.image || dp} alt={user.name} className='w-full h-full object-cover object-top'/>
      </div>

      {/* User Name */}
      <h1 className='font-semibold !text-[20px] text-gray-700'>{user.name || user.username}</h1>
        </div>
       ))}
      </div>

      


    </div>
  )
}

export default Sidebar