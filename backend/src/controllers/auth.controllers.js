import User from "../models/user.models.js";
import {asyncHandler} from "../utils/asyncHandler.js"
import {apiError} from "../utils/apiError.js"
import {apiResponse} from "../utils/apiResponse.js"

const generateAccessAndRefreshTokens=async(userId)=>{
  try {    
    const user= await User.findById(userId);
    const accessToken= user.generateAccessToken();
    const refreshToken=user.generateRefreshToken();

    user.refreshToken= refreshToken;
    await user.save({validateBeforeSave: false}); 
    
    return {accessToken, refreshToken}; 

  } catch (error) {
    throw new apiError(500, "Something went wrong while generating token")
  }
}

const signUp=asyncHandler(async(req,res)=>{
   try {
     const {username, email, password}=req.body;

     const existed_user=await User.findOne({
        $or:[{email},{username}]
    })
    if(existed_user){
        throw new apiError(400,"User already exist!!")
    }

    const user=await User.create({
        username,
        email,
        password
    })

    const createuser=await User.findById(user._id).select(
    "-password -refreshToken"
    )
    if(!createuser){
    throw new apiError(400, "Something went wrong while registering the user");
    }     

    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user?._id);

    const isProduction = process.env.NODE_ENV === "production";
    const options={
         httpOnly: true,
        secure: isProduction,
        sameSite: isProduction?"none":"lax",
        maxAge: 7 * 24 * 60 * 60 * 1000 
    }
    res.clearCookie("token");

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new apiResponse(200,createuser,"Sign up successful"))

   } catch (error) {
     if (error.name === "ValidationError") {
       const errors = Object.values(error.errors).map(err => err.message);
       throw new apiError(401, "Password must be 8 letters", errors)
    }
    
    if (error instanceof apiError) {
    // custom apiError (like “User already exist!!”) → rethrow as is
    throw error;
  }
  //for something unusual error    
  throw new apiError(501, "Something went wrong during signup")
    

   }
})

const login=asyncHandler(async(req,res)=>{
    const{email, password}=req.body
    if (!email) {
      throw new apiError(400, "Email is required", ["Email cannot be empty"]);
    }

    if (!password) {
      throw new apiError(400, "Password is required", ["Password cannot be empty"]);
    }

    const user= await User.findOne({email});
    if(!user){
        throw new apiError(404, "user doesn't exist");
    }

    const isPasswordValid=await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new apiError(401, "Incorrect Password");
    }

    const{accessToken, refreshToken}=await generateAccessAndRefreshTokens(user._id);
    const loggedInUser=await User.findById(user._id).select("-password -refreshToken");

    const isProduction = process.env.NODE_ENV === "production";
    const options={
         httpOnly: true,
        secure: isProduction,
        sameSite: isProduction?"none":"lax",
        maxAge: 7 * 24 * 60 * 60 * 1000 
    }

     return res.status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(new apiResponse(200,loggedInUser,"User Logged in successfully"))

})

const logout=asyncHandler(async(req, res)=>{
    await User.findByIdAndUpdate(
        req.user?._id,{
            $unset:{
                refreshToken:1
            }
        },{
            new: true
        }
    )

   const isProduction = process.env.NODE_ENV === "production";
    const options={
         httpOnly: true,
        secure: isProduction,
        sameSite: isProduction?"none":"lax",
        maxAge: 7 * 24 * 60 * 60 * 1000 
    }

    return res
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json( new apiResponse(200,{}, "User Logged out Successfully"))
})



export {
    signUp,
    login,
    logout
}