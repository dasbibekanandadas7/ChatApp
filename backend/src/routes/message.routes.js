import {Router} from 'express'
import {verifyJWT} from "../middlewares/auth.middlewares.js" 
import { upload } from '../middlewares/multer.middlewares.js'
import {getMessages, sendMessage} from "../controllers/message.controllers.js"

const messageRouter=Router()

messageRouter.route("/send/:receiver").post(verifyJWT,upload.single("image"),sendMessage)
messageRouter.route("/get/:receiver").get(verifyJWT,getMessages)

export default messageRouter