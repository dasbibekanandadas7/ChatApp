import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.models.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

const getCurrentUser=asyncHandler(async(req,res)=>{
    try {
        const userId=req.user?._id
        const user=await User.findById(userId).select("-password refreshToken")

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

export {
    getCurrentUser
}