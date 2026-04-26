import userModel from "../models/user.model.js"
import jwt from 'jsonwebtoken'
import { sendVerificationEmail } from "../services/mail.service.js"
import AppError from "../utils/AppError.js"
import buildVerifyPage from "../utils/verifyPage.js"
import redis from "../config/cache.js"

export const registerController = async (req, res) => {
    const { username, email, password } = req.body

    const isAlreadyExist = await userModel.findOne({
        $or: [{ username }, { email }]
    })

    if (isAlreadyExist) {
        throw new AppError("User already exists", 409)
    }

    const user = await userModel.create({ username, email, password })

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" })

    await sendVerificationEmail({ name: user.username, email: user.email, token })

    res.status(201).json({
        success: true,
        message: "User created successfully",
        user: {
            id: user._id,
            email: user.email,
            username: user.username
        }
    })

}

export const verifyEmailController = async (req, res) => {
    const { token } = req.query

    if (!token) {
        return res.status(400).send(buildVerifyPage({
            success: false,
            title: 'Link expired',
            message: 'This verification link has expired or has already been used.',
        }))
    }

    let decode
    try {
        decode = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        return res.status(400).send(buildVerifyPage({
            success: false,
            title: 'Link expired',
            message: 'This verification link has expired or has already been used.',
        }))
    }

    const user = await userModel.findOne({ email: decode.email })

    if (!user) {
        return res.status(404).send(buildVerifyPage({
            success: false,
            title: 'Account not found',
            message: 'We could not find an account for this verification link. Please register again or request a new verification email.',
        }))
    }

    if (user.isVerified) {
        return res.status(400).send(buildVerifyPage({
            success: false,
            title: 'Email already verified',
            message: 'Your email is already verified. You can log in to your Arkio. account.',
        }))
    }

    user.isVerified = true
    await user.save()
    return res.status(200).send(buildVerifyPage({
        success: true,
        title: 'Email verified',
        message: 'Your email address has been verified successfully. You can now log in to your Arkio. account.',
    }))
}

export const loginController = async (req, res) => {
    const {identifier, password} = req.body

    const user = await userModel.findOne({
        $or:[{email: identifier}, {username: identifier}]
    }).select('+password')

    if(!user){
        throw new AppError("Invalid credentials", 401)
    }

    if(!user.isVerified){
        throw new AppError("Email not verified. Please verify your email before logging in.", 401)
    }

    const isMatch = await user.comparePassword(password)

    if(!isMatch){
        throw new AppError("Invalid credentials", 401)
    }

    const token = jwt.sign({id: user._id, username: user.username}, process.env.JWT_SECRET, {expiresIn:"7d"})

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV == "production",
        sameSite: process.env.NODE_ENV == "production" ? "None" : "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
        success: true,
        message: "Logged in successfully",
        user: {
            id: user._id,   
            email: user.email,
            username: user.username,
            isVerified: user.isVerified
        }   
    })


}

export const getMeController = async (req, res) => {
    const userId = req.user.id

    const user = await userModel.findById(userId)
    
    if(!user){
        throw new AppError("User not found", 404)
    }

    res.status(200).json({
        success: true,
        user
    })
}

export const logoutController = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "No token provided",
    });
  }

  const decoded = jwt.decode(token);
  const expiry = decoded.exp - Math.floor(Date.now() / 1000);

  await redis.set(token, "blacklisted", "EX", expiry);

  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV == "production",
    sameSite: process.env.NODE_ENV == "production" ? "None" : "Lax",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

// export const resendVerificationController = async (req, res) => {
//     const { email } = req.body

//     const user = await userModel.findOne({ email })

//     if (!user || user.isVerified) {
//         return res.status(200).send(buildVerifyPage({
//             success: true,
//             title: 'Check your inbox',
//             message: 'If that email exists and is unverified, a fresh verification link is on its way. Check your inbox.',
//         }))
//     }

//     const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" })

//     await sendVerificationEmail({ name: user.username, email: user.email, token })

//     return res.status(200).send(buildVerifyPage({
//         success: true,
//         title: 'Check your inbox',
//         message: 'A fresh verification link has been sent to your email address. It expires in 24 hours.',
//     }))
// }
