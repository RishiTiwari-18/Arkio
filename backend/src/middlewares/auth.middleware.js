import jwt from "jsonwebtoken"
import AppError from "../utils/AppError.js"

const authUser = async (req, res, next) => {
    const token = req.cookies.token

    if(!token) {
        throw new AppError("Unauthorized", 401)
    }

    let decode
    try {
        decode = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        throw new AppError("Unauthorized", 401)
    }
    
    req.user = decode

    next()
}

export default authUser