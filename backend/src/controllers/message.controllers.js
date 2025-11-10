import {asyncHandler} from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import Conversation from "../models/conversation.models.js"
import Message from "../models/message.models.js"
import { apiError } from "../utils/apiError.js"
import { apiResponse } from "../utils/apiResponse.js"

const sendMessage=asyncHandler(async(req,res)=>{
   try {
    const sender=req.user?._id
    const {receiver}=req.params

    const {message}=req.body
    let image="";

    if(req.file){
        image=await uploadOnCloudinary(req.file.path)
    }

    let conversation=await Conversation.findOne({
        participants:{$all:[sender, receiver]}
    })

    const newMessage=await Message.create({
        sender,
        receiver,
        image:image.secure_url,
        message
    })

    if(!conversation){
          conversation=await Conversation.create({
          participants:[sender, receiver],
          messages:[newMessage._id]
       })
    }
    else{
       conversation.messages.push(newMessage._id)
       await conversation.save()
    }

    return res.status(200)
    .json(new apiResponse(200,newMessage,"Message sent successfully"))

   } catch (error) {
      if (error instanceof apiError) throw error;
           throw new apiError(401, "Error in send Messages")
   }
})

const getMessages=asyncHandler(async(req,res)=>{
   try {
    const sender=req.user?._id
    const {receiver}=req.params
    
    const conversation=await Conversation.findOne({
        participants:{$all:[sender, receiver]}
    }).populate("messages")

    if(!conversation){
        throw new apiError(401, "Conversation not found")
    }
    return res.status(200)
    .json(new apiResponse(200,conversation?.messages,"Conversation found"))

   } catch (error) {
    if (error instanceof apiError) throw error;
    throw new apiError(401, "Error in Get Messages")
   }
})

export {
    sendMessage,
    getMessages
}