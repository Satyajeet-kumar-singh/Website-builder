import express from "express"
import { getCurrentUser, generatedemo } from "../controller/user.controller.js";
import isAuth from "../middleware/isAuth.js"

const userRouter = express.Router()

userRouter.get("/me",isAuth,getCurrentUser)
userRouter.get("/gen",generatedemo)


export default userRouter;