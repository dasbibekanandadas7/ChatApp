import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { serverurl } from '../config.js';
import axios from 'axios'
import {useDispatch, useSelector} from "react-redux"
import { setUserData } from '../redux/userSlice.js';

function Signup() {
  const navigate=useNavigate();
  const[show, setShow]=useState(false)
  const[username, setUsername]=useState("")
  const[email,setEmail]=useState("")
  const[password, setPassword]=useState("")
  const[loading,setLoading]=useState(false)
  const[error, setError]=useState("")
  
  const dispatch=useDispatch()

  const handleSignup=async(e)=>{
    e.preventDefault()
    setLoading(true)
    try {
      const result=await axios.post(`${serverurl}/api/v2/auth/signup`,{
          username,
          email,
          password
      },{withCredentials:true})
      console.log(result);
      dispatch(setUserData(result.data.data))
      setUsername("")
      setEmail("")
      setPassword("")
      setLoading(false)
      setError("")
    } catch (error) {
       setLoading(false);
      if (error.response) {
      const backendError = error.response.data;
      setError(backendError.errors?.[0] || backendError.message);
      } else {
       setError("Something went wrong!");
      }
    }
  }

  return (
    <div className='w-screen h-screen bg-slate-200 flex justify-center items-center'>
       <div className='w-full max-w-[500px] h-[600px] bg-white rounded-lg shadow-lg shadow-gray-400 flex flex-col gap-[30px]'>
          <div className='w-full h-[200px] bg-[#20c7ff] rounded-b-[30%] shadow-lg shadow-gray-400 flex justify-center items-center'>
            <h1 className='text-gray-600 font-bold !text-[30px]'>Welcome to <span className='text-white'>Chitchat</span></h1>
          </div>
         
        <form className='w-full flex flex-col gap-[20px] items-center' onSubmit={handleSignup}>
          <input type="text" placeholder='username' className='w-[90%] h-[60px] outline-none border-2 border-[#20c7ff] px-[20px] 
          py-[10px] bg-blue-50 rounded-lg shadow-lg shadow-gray-200' onChange={(e)=>setUsername(e.target.value)} value={username}/>
          <input type="email" placeholder='email'  className='w-[90%] h-[60px] outline-none border-2 border-[#20c7ff] px-[20px] 
          py-[10px] bg-blue-50 rounded-lg shadow-lg shadow-gray-200' onChange={(e)=>setEmail(e.target.value)} value={email}/>
          <div className='w-[90%] h-[50px] border-2 border-[#20c7ff] overflow-hidden rounded-lg  shadow-lg shadow-gray-200 bg-blue-50 relative'>
            <input type={`${show?"text":"password"}`} placeholder='password'  className='w-[90%] h-full outline-none px-[20px] 
             py-[10px]' onChange={(e)=>setPassword(e.target.value)} value={password} />
             <span className='absolute top-[10px] right-[20px] text-[19px] text-blue-500 cursor-pointer' onClick={()=>setShow(prev=>!prev)}>{`${show?"hidden":"show"}`}</span>
          </div>

          {error && <p className='text-center text-red-500'>*{error}</p>}

          <button type='submit' className='p-[20px] py-[20px] !bg-[#20c7ff] !rounded-2xl shadow-lg shadow-gray-200 mt-[20px] text-[20px] w-[150px] !font-bold' disabled={loading}>
            {loading?"Loading...":"Signup"}
          </button>
          <p>Already have an Account? <span className='text-blue-700 cursor-pointer !text-[bold]' onClick={()=>navigate("/login")}>Login</span></p>
        </form>
       </div>        
    </div>
  )
}

export default Signup