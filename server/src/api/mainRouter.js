import express from "express"

import userController from "../controller/user.controller.js"

import checkAuth from "../middleware/checkAuth.js"
import authRouter from "./auth.router.js"
import Upload from "../middleware/multer.js"

const apiRouter = express.Router()

apiRouter.use(authRouter) // Authentication related routes

apiRouter.use(checkAuth)

apiRouter.route("/user/profile").put(Upload().single('avatar'), userController.updateProfile)

export default apiRouter
