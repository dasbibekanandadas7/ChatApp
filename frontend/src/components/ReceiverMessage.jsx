import React from 'react'
import dp from "../assets/dp.webp"

function ReceiverMessage({image,message}) {
  return (
     <div className='w-fit mt-2 px-[20px] py-[10px] max-w-[500px] bg-[#457d90]  text-[18px] rounded-tl-none rounded-2xl relative left-0 shadow -gray-400 shadow-lg gap-[10px] flex flex-col'>
            {
             image && <img src={image} alt="" className='w-[150px] rounded-lg'/>
            }
            {
             message &&  <span>{message}</span>
            }
        </div>
  )
}

export default ReceiverMessage