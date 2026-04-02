import { Router } from "express"
import authUser from "../middlewares/auth.middleware.js"
import { deleteMessages, getChats, getMessages, sendMessage } from "../controllers/chat.controller.js"

const chatRouter = Router()

chatRouter.post("/message", authUser, sendMessage)

chatRouter.get("/", authUser, getChats)

chatRouter.get("/message/:chatId", authUser, getMessages)

chatRouter.delete("/delete/:chatId", authUser, deleteMessages)

export default chatRouter