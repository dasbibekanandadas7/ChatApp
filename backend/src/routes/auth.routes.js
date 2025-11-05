import {Router} from 'express'
import { signUp, login, logout } from '../controllers/auth.controllers.js'
import {verifyJWT} from "../middlewares/auth.middlewares.js" 

const authRouter=Router()

authRouter.route("/signup").post(signUp)
authRouter.route("/login").post(login);

//secured path
authRouter.route("/logout").get(verifyJWT,logout)

export default authRouter