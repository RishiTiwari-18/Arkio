import { Router } from "express"
import { getMeController, loginController, registerController, verifyEmailController } from "../controllers/auth.controller.js"
import asyncHandler from "../utils/AsyncHandler.js"
import { loginValidator, registerValidator } from "../validators/auth.validator.js"
import validate from "../middlewares/validate.js"

const authRouter = Router()

authRouter.post("/register", registerValidator, validate, asyncHandler(registerController))

authRouter.get("/verify-email", asyncHandler(verifyEmailController))

// authRouter.post("/resend-verification", asyncHandler(resendVerificationController))

authRouter.post("/login", loginValidator, validate,  asyncHandler(loginController))

authRouter.post("/get-me", asyncHandler(getMeController))

export default authRouter