import { Router } from "express"
import { getMeController, loginController, logoutController, registerController, verifyEmailController } from "../controllers/auth.controller.js"
import asyncHandler from "../utils/asyncHandler.js"
import { loginValidator, registerValidator } from "../validators/auth.validator.js"
import validate from "../middlewares/validate.js"
import authUser from "../middlewares/auth.middleware.js"

const authRouter = Router()

authRouter.post("/register", registerValidator, validate, asyncHandler(registerController))

authRouter.get("/verify-email", asyncHandler(verifyEmailController))

// authRouter.post("/resend-verification", asyncHandler(resendVerificationController))

authRouter.post("/login", loginValidator, validate,  asyncHandler(loginController))

authRouter.post("/logout", asyncHandler(logoutController))

authRouter.get("/get-me", authUser, asyncHandler(getMeController))

export default authRouter