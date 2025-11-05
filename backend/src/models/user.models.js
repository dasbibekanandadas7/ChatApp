import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address']
    },
    password:{
        type: String,
        required: true,
        minlength: [8, "Password must be at least 8 characters long"]
    },
    image:{
        type: String,
        default:""
    },
    refreshToken:{
        type: String,
    }
},{timestamps:true})


userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
   this.password=await bcrypt.hash(this.password,10);
   next();
})

userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken=function(){
   return jwt.sign(
    {
        _id:this._id,
        email:this.email,
        firstname:this.firstname,
        lastname:this.lastname
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
   )
}

userSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
    {
        _id:this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
   )
}

const User=new mongoose.model("User",userSchema)

export default User