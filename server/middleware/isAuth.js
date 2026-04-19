import { handleError } from "../helper/handleError.js"
import jwt from "jsonwebtoken"
import User from "../model/user.model.js"

const isAuth=async(req,res,next)=>{
    try {
        const token = req.cookies.token
        if(!token){
            return next(handleError(400,"token not found"))
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.user = await User.findById(decoded.id)
        // console.log(req.user)
        return next()
    } catch (error) {
        return next(handleError(500,`is auth middleware ${error}`))
    }
}

export default isAuth;