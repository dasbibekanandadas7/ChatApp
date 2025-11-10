import {Router} from 'express'
import {verifyJWT} from "../middlewares/auth.middlewares.js" 
import { editProfile, getCurrentUser, getOtherUsers, search } from '../controllers/user.controllers.js'
import { upload } from '../middlewares/multer.middlewares.js'

const userRouter=Router()

userRouter.route("/currentuser").get(verifyJWT,getCurrentUser)
userRouter.route("/profile").put(verifyJWT,upload.single("image"),editProfile)
userRouter.route("/others").get(verifyJWT,getOtherUsers)
userRouter.route("/search").get(verifyJWT,search)

export default userRouter