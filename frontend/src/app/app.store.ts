import authReducer from "@/features/auth/auth.slice"
import { configureStore } from "@reduxjs/toolkit"

export const store = configureStore({
    reducer:{
        auth: authReducer,
        
    }
})
