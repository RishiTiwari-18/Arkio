import api from "../../../lib/axios"
import type { LoginPayload, RegisterPayload } from "../types"

export const loginApi = async (data: LoginPayload) => {
    const res = await api.post("/auth/login", data)
    return res.data
}

export const registerApi = async (data: RegisterPayload) => {
    const res = await api.post("/auth/register", data)
    return res.data
}

export const getMeApi = async () => {
    const res = await api.get("/auth/get-me")
    return res.data
}