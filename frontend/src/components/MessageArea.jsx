import React, { useState, useRef, useEffect} from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import dp from "../assets/dp.webp"
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../redux/userSlice';
import { RiEmojiStickerLine } from "react-icons/ri";
import { FaImages } from "react-icons/fa";
import { LuSendHorizontal } from "react-icons/lu";
import EmojiPicker from 'emoji-picker-react';
import SenderMessage from "./SenderMessage"
import ReceiverMessage from "./ReceiverMessage"
import axios from 'axios'
import {serverurl} from "../config"
import { setMessages } from '../redux/messageSlice';

function MessageArea() {
  const {selectedUser, userData,socket}=useSelector(state=>state.user)
  const {messages}=useSelector(state=>state.message)

  const dispatch=useDispatch()
  const formRef = useRef(null)

  const[showPicker, setShowPicker]=useState(false)
  const[input,setInput]=useState("")
  const[frontendImage, setFrontendImage]=useState("")
   const[backendImage, setBackendImage]=useState("")

   const image=useRef()

  const onEmojiClick=(emojiData)=>{
    setInput(prevInput=>prevInput+emojiData.emoji)
  }

  const handleSendMessage=async(e)=>{
    e.preventDefault()
    if(input.length==0 && backendImage==null){
      return
    }
    setShowPicker(false)
    try {
      const formData=new FormData()
      formData.append("message",input)
      if(backendImage){
        formData.append("image",backendImage)
      }
      const result=await axios.post(`${serverurl}/api/v2/message/send/${selectedUser._id}`,formData,{withCredentials:true})
      const newMessage = result.data.data;
      const current = Array.isArray(messages) ? messages : [];
      dispatch(setMessages([...current, newMessage]));

      setInput("")
      setFrontendImage("")
      setBackendImage("")
    } catch (error) {
      console.log("error at handleSendMessage",error);
    }
  }

  const handleImage=(e)=>{
    const file=e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }


  useEffect(()=>{
    socket.on("newMessage",(mess)=>{
      dispatch(setMessages([...messages,mess]))
    })

    return ()=>socket.off("newMessage")
  },[messages,setMessages])

  return (
    <div className={`lg:w-[70%] ${selectedUser?"flex":"hidden"} lg:flex w-full h-full bg-slate-200 !border-l-4 border-gray-300 relative`}>
      {selectedUser &&

      <div className='w-full h-[90vh] flex flex-col'>
       <div className='w-full h-[100px] bg-[#0b465a] rounded-b-[30px] shadow-lg flex items-center gap-[20px] px-[20px] py-[70px] gap-[20px]'>
        <div className='cursor-pointer' onClick={()=>dispatch(setSelectedUser(null))}>
                <IoIosArrowRoundBack className='w-[50px] h-[50px] text-white'/>
        </div>

         <div className='w-[80px] h-[80px] rounded-full overflow-hidden flex justify-center items-center  shadow-lg cursor-pointer' onClick={()=>navigate("/profile")}>
                <img src={selectedUser?.image || dp} alt="" className='w-full h-full object-cover object-top'/>
          </div>
          <h1 className='text-white font-semibold text-[19px]'>
            {selectedUser?.name || selectedUser?.username}
          </h1>
      </div>

      <div className='w-full h-[900px] bg-sky-100 flex flex-col py-[30px] px-[20px] overflow-auto hide-scrollbar'>
      {showPicker &&
        <div className='absolute bottom-[90px] left-[20px]'>
          <EmojiPicker width={350} height={450} className='shadow-lg' onEmojiClick={onEmojiClick}/>
        </div>       
      }
       {/* <SenderMessage/ > */}

       {messages && messages.map((mess)=>(
         mess.sender==userData._id?<SenderMessage key={mess._id} image={mess.image} message={mess.message}/>:
         <ReceiverMessage key={mess._id} image={mess.image} message={mess.message}/>
       ))}
      </div>

       <div className="w-full lg:w-[80%] h-[100px] fixed bottom-0 flex items-center justify-start px-6">
     <form className="w-[80%] bg-[#2ebeee] h-[60px] rounded-full shadow-md flex items-center px-4 relative" ref={formRef} onSubmit={handleSendMessage}>
    

    <RiEmojiStickerLine className="text-4xl text-gray-700 mr-3 cursor-pointer" onClick={()=>setShowPicker(prev=>!prev)}/>
    
    <input type="file" accept='image/*' ref={image} hidden onChange={handleImage}/>
    <input
      type="text"
      placeholder="Type a message"
      className="flex-1 bg-transparent outline-none text-2xl text-gray-800 placeholder-gray-500"
      onChange={(e)=>setInput(e.target.value)}
      value={input}
    />

   {/* Image preview — shown above image icon */}
{frontendImage && (
  <div className="absolute bottom-[70px] right-[20px] group">
    <img
      src={frontendImage}
      alt="preview"
      className="w-[200px] h-[200px] rounded-xl shadow-md border border-gray-300 object-cover"
    />

    {/* Remove button — only visible on hover */}
    <button
      type="button"
      className="absolute top-[-10px] right-[-10px] bg-white text-black !rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      onClick={() => {
        setFrontendImage("");
        setBackendImage("");
        image.current.value = "";
      }}
    >
      ✕
    </button>
  </div>
)}

    <div>
      <FaImages className='text-4xl text-gray-700 ml-3 cursor-pointer' onClick={()=>{
        image.current.value = "";
        image.current.click()}}/>
    </div>
  
  </form>

  {(input.length>0 || backendImage) && (<div className="w-[60px] h-[60px] bg-[#2ebeee] rounded-full flex items-center justify-center cursor-pointer shadow-md ml-5" onClick={() => formRef.current.requestSubmit()}>
    <LuSendHorizontal className="text-3xl text-white" />
  </div>)}

 </div>
      </div>

      
      }

      {
        !selectedUser &&
        <div className='w-full h-full flex flex-col justify-center items-center text-gray-400'>
          <h1 className='!text-[50px] font-bold'>Welcome to Chitchat</h1>
          <span className='!text-[25px]'>Chat for fun...................</span>
        </div>
      }

      {/* messaging area */}
    




    </div>
  )
}

export default MessageArea