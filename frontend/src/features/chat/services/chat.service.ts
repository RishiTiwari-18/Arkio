import api from "@/lib/axios";
import type { chatPayload } from "../types";

export const sendMessage = async ({message, chatId}: chatPayload) => {
    const res = await api.post("/chats/message", {message, chatId})
    return res.data
}

export const getChats = async () => {
    const res = await api.get("/chats")
    return res.data
}

export const getMessage = async (chatId: string) => {
    const res = await api.get(`/chats/message/${chatId}`)
    return res.data
}

export const deleteChat = async (chatId: string) => {
    const res = await api.delete(`chats/delete/${chatId}`)
    return res.data
}