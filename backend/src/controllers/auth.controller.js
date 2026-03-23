import userModel from "../models/user.model.js"
import { sendVerificationEmail } from "../services/mail.service.js"
import AppError from "../utils/AppError.js"

export const registerController = async (req, res) => {
    const { username, email, password } = req.body

    const isAlreadyExist = await userModel.findOne({
        $or:[{username},{email}]
    })

    if(isAlreadyExist){
        throw new AppError("User already exists", 409)
    }

    const user = await userModel.create({username, email, password})

    await sendVerificationEmail({ name: user.username, email: user.email })

    res.status(201).json({
        success: true,
        message: "User created successfully",
        user: {
            id: user._id,
            email : user.email,
            username: user.username
        }
    })

}

export const loginController = async (req, res) => {

}

export const getMeController = async (req, res) => {
    
}