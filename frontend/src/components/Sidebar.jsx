import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import dp from "../assets/dp.webp"
import { IoSearch } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";

function Sidebar() {
    const {userData}=useSelector(state=>state.user)
    const[search, setSearch]=useState(false)

  return (
    <div className='lg:w-[30%] w-full h-full overflow-hidden lg:block bg-white'>


      <div className='w-full h-[400px] bg-[#20c7ff] rounded-b-[30%] shadow-lg shadow-gray-400 flex flex-col gap-[20px] px-[20px] py-[70px] gap-[20px]'>
      <h1 className='text-white font-bold text-[19px]'>ChitChat</h1>
        <div className='w-full flex justify-between items-center font-bold text-[12px]'>
          <h1>Hi, {userData.name}</h1>
           <div className='w-[80px] h-[80px] rounded-full overflow-hidden flex justify-center items-center shadow-gray-400 shadow-lg'>
              <img src={userData.image || dp} alt="" className='w-full h-full object-cover object-top'/>
           </div>
        </div>

        {!search &&
        <div className='w-[60px] h-[60px] rounded-full overflow-hidden flex justify-center items-center shadow-gray-400 shadow-lg bg-white cursor-pointer' onClick={()=>setSearch(true)}>
            <IoSearch className='w-[25px] h-[25px]'/>
        </div>
        }
        {search && 
         <form className='w-full h-[60px] bg-white shadow-gray-400 shadow-lg flex items-center gap-[10px] rounded-full'>
             <IoSearch className='w-[30px] h-[30px] ml-3'/>
             <input type="text" placeholder='search user...' className='w-full h-full outline-0 border-0 text-[20px] font-semibold'/>
             <RxCross2 className='w-[30px] h-[30px] cursor-pointer mr-5' onClick={()=>setSearch(false)}/>
         </form>
        }

      </div>


    </div>
  )
}

export default Sidebar