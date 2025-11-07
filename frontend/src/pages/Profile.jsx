import React, { useRef, useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoCameraOutline } from "react-icons/io5";
import dp from "../assets/dp.webp"
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverurl } from '../config';
import { setUserData } from '../redux/userSlice';

function Profile() {
    const {userData}=useSelector(state=>state.user)
    const dispatch=useDispatch()

    const[name, setName]=useState(userData.name || "")
    const[frontendImage,setFrontendImage]=useState(userData.image || dp)
    const[backendImage,setBackendImage]=useState(null)
    const[loading, setLoading]=useState(false)

    const navigate=useNavigate()

    let image=useRef()

    const handleImage=(e)=>{
       const file = e.target.files[0];
       if (!file) return;

       setBackendImage(file)
       setFrontendImage(URL.createObjectURL(file))
    }

    const handleProfile=async(e)=>{
        e.preventDefault()
        setLoading(true)
        try {
            const formData=new FormData;
            formData.append("name",name)
            if(backendImage){
                formData.append("image",backendImage) //image name must be same as multer
            } 
            const result=await axios.put(`${serverurl}/api/v2/user/profile`,formData,{withCredentials:true})
            dispatch(setUserData(result.data.data))
            setLoading(false)
        } catch (error) {
             console.log("error in handle Profile",error);
             setLoading(false)
        }
    }

  return (
    <div className='w-screen h-[100vh] bg-slate-200 flex flex-col justify-center items-center gap-[20px]'>
     
     
      {/* back icon */}
      <div className='fixed top-[20px] left-[20px] cursor-pointer' onClick={()=>navigate("/")}>
        <IoIosArrowRoundBack className='w-[50px] h-[50px] text-gray-600'/>
      </div>

      {/* profile picture icon */}
      <div className='g-white rounded-full border-4 border-[#20c7ff] shadow-gray-400 shadow-lg  relative'>
         <div className='w-[200px] h-[200px] rounded-full overflow-hidden flex justify-center items-center'>
              <img src={frontendImage || dp} alt="" className='w-full h-full object-cover object-top'/>
         </div>
         <div className='absolute bottom-4  text-gray-700 right-4 w-[35px] h-[35px] rounded-full bg-[#20c7ff] flex justify-center items-center shadow-gray-400 shadow-lg cursor-pointer' onClick={()=>image.current.click()}>
         <IoCameraOutline className=' text-gray-700  w-[25px] h-[25px]'/>
         </div>
      </div>

      <form className='w-[95%]  max-w-[500px] flex flex-col gap-[20px] items-center justify-center' onSubmit={handleProfile}>
        <input type="file" accept='image/*' ref={image} hidden onChange={handleImage}/>
        <input type="text" value={name} placeholder='Enter your name'  className='w-[90%] h-[50px] outline-none border-2 border-[#20c7ff] px-[20px] py-[10px] bg-[white] rounded-lg shadow-gray-400 shadow-lg text-gray-700 text-[19px]' onChange={(e)=>setName(e.target.value)}/>
        <input type="text" readOnly value={userData?.username} className='w-[90%] h-[50px] outline-none border-2 border-[#20c7ff] px-[20px] py-[10px] bg-gray-200 rounded-lg shadow-gray-400 shadow-lg text-gray-400 text-[19px]'/>
        <input type="text" readOnly value={userData?.email} className='w-[90%] h-[50px] outline-none border-2 border-[#20c7ff] px-[20px] py-[10px] bg-gray-200 rounded-lg shadow-gray-400 shadow-lg text-gray-400 text-[19px]'/>
        <button className='px-[20px] py-[10px] !bg-[#20c7ff] rounded-2xl shadow-gray-400 shadow-lg text-[20px] w-[200px] mt-[20px] font-semibold hover:shadow-inner' disabled={loading}>{loading?"Saving...":"Save Profile"}</button>
      </form>

    </div>
  )
}

export default Profile