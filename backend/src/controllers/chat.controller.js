import chatModel from "../models/chat.model.js"
import messageModel from "../models/message.model.js"
import { generateContent, generateTitle } from "../services/ai.service.js"
import AppError from "../utils/AppError.js"

export const sendMessage = async (req, res) => {
    const { message, chatId } = req.body
    const userId = req.user.id

    let chat = null;

    if (!chatId) {
        const title = await generateTitle(message)

        chat = await chatModel.create({
            user: userId,
            title,
        })
    }

    const currentChatId = chatId || chat._id;

    const userMessage = await messageModel.create({
        chat: currentChatId,
        user: userId,
        role: "user",
        content: message,
    })

    const allMessages = await messageModel.find({ chat: currentChatId }).sort({ createdAt: 1 })

    const aiContent = await generateContent(allMessages)

    const aiMessage = await messageModel.create({
        chat: currentChatId,
        user: userId,
        role: "ai",
        content: aiContent,
    })

    res.status(201).json({
      chatId: currentChatId,
      chat: chat, // null if existing
      newMessages: [userMessage, aiMessage],
    });
}

export const getChats = async (req, res) => {
    const userId = req.user.id

    const chats = await chatModel.find({user: userId}).sort({createdAt: 1})

    if(!chats){
        throw new AppError("Chats not found", 404)
    }

    res.status(200).json({
        success: true,
        chats
    })
}

export const getMessages = async (req, res) => {
    const { chatId } = req.params
    const userId = req.user.id

    const chats = await chatModel.findOne({ _id: chatId, user: userId}).sort({createdAt: 1})

    if(!chats){
        throw new AppError("Chats not found", 404)
    }

    const messages = await messageModel.find({chat:chatId})

    res.status(200).json({
        success: true,
        messages
    })
}

export const deleteMessages = async (req, res)=> {
    const { chatId } = req.params
    const userId = req.body.id

    const chat = await chatModel.findOneAndDelete({
        _id: chatId,
        user: userId
    })

    if(!chat){
        throw new AppError("Chat not found", 404)
    }

    await messageModel.deleteMany({chat: chatId})

    res.status(200).json({
        success: true,
        message: "Chat deleted successfully"
    })
}