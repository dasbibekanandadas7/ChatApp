import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.models.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"

const getCurrentUser=asyncHandler(async(req,res)=>{
    try {
        const userId=req.user?._id
        const user=await User.findById(userId).select("-password -refreshToken")
        if(!user){
            throw new apiError(401, "user doesn't exist")
        }
  
        return res.status(200)
        .json(new apiResponse(200,user,"UserData found successfully"))

    } catch (error) {
        // If it’s already a known apiError, rethrow it as is
        if (error instanceof apiError) throw error;

        // Otherwise wrap it as a new one  
        throw new apiError(401, "Error in getCurrent Use")
    }
})

const editProfile=asyncHandler(async(req,res)=>{
   try {
     const {name}=req.body
     let uploadImage;

     if(req.file){
        uploadImage=await uploadOnCloudinary(req.file?.path)
     }

     const updateData = { name };

    // Add image field only if upload succeeded
    if (uploadImage && uploadImage.secure_url) {
      updateData.image = uploadImage.secure_url;
    }


     const user=await User.findByIdAndUpdate(req.user._id,
        updateData,
        {new:true}
    ).select("-refreshToken -password")
     
     if(!user){
        throw new apiError(401,"User not found")
     }
    
     return res.status(200)
     .json(new apiResponse(200,user,"Profile picture uploaded successfully"))
   } catch (error) {
      if (error instanceof apiError) throw error;
      throw new apiError(401, "Error in getCurrent Use")
   }
})

const getOtherUsers=asyncHandler(async(req,res)=>{
    try {
        const users=await User.find({
            _id:{
                $ne:req.user?._id
            }
        }).select("-password -refreshToken")

        return res.status(200)
        .json(new apiResponse(200,users,"All other users found successfully"))
    } catch (error) {
        throw new apiError("Error in getOtherUsers", getOtherUsers)
    }
})


const search=asyncHandler(async(req,res)=>{
    try {
        const {query}=req.query
        if(!query){
            throw new apiError(400, "query is required")
        }

        const users=await User.find({
            $or:[
                {name:{$regex:query,$options:"i"}},
                {username:{$regex:query,$options:"i"}}
            ]
        })

        return res.status(200)
        .json(new apiResponse(200,users,"Succesfully fetched the user"))
    } catch (error) {
        if (error instanceof apiError) throw error;
      throw new apiError(401, "Error in search controller")
    }
})

export {
    getCurrentUser,
    editProfile,
    getOtherUsers,
    search
}