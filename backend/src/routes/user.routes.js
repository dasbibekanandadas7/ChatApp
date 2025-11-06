import {Router} from 'express'
import {verifyJWT} from "../middlewares/auth.middlewares.js" 
import { getCurrentUser } from '../controllers/user.controllers.js'

const userRouter=Router()

userRouter.route("/currentuser").get(verifyJWT,getCurrentUser)

export default userRouter