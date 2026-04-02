import authReducer from "@/features/auth/auth.slice"
import chatReducer from "@/features/chat/chats.slice"
import { configureStore } from "@reduxjs/toolkit"

export const store = configureStore({
    reducer:{
        auth: authReducer,
        chat: chatReducer
    }
})
