import jwt from "jsonwebtoken"
import AppError from "../utils/AppError.js"

const authUser = (req, res, next) => {
    const token = req.cookies.token

    if(!token) {
        throw new AppError("Unauthorized", 401)
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET)
    
    req.user = decode

    next()
}

export default authUser