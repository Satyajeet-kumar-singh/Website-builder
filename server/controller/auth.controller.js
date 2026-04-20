import { handleError } from "../helper/handleError.js"
import User from "../model/user.model.js"
import jwt from "jsonwebtoken"

export const googleAuth=async(req,res,next)=>{
    try {
        const {name,email,avatar} = req.body
        if(!email){
            return next(handleError(400,"email is required"))
        }

        const user = await User.findOne({email})
        if(!user){
            const user = await User.create({
                name,
                email,
                avatar
            })
        }

        const token = await jwt.sign({id:user.id},process.env.JWT_SECRET,{expiresIn:"7d"})

        res.cookie("token",token,{
            httpOnly:true,
            secure:true,
            sameSite:"none",
            maxAge:7*24*60*60*1000
        })

        return res.status(200).json(user)
    } catch (error) {
        return next(handleError(500,`google auth error ${error.message}`))
    }
}

export const logout=(req,res,next)=>{
    try {
        res.clearCookie("token",{
            httpOnly:true,
            secure:true,
            sameSite:"none"
        })

        res.status(200).json({
            success:true,
            message:"logout successfully"
        })
    } catch (error) {
        return next(handleError(500,`logout error ${error.message}`))
    }
}
