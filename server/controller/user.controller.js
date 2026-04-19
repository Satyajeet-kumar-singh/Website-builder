import { handleError } from "../helper/handleError.js"
import {generateResponse} from "../config/openRouter.js"
import extractJson from "../utils/extractJson.js"


export const getCurrentUser=async(req,res,next)=>{
    try {
        if(!req.user){
            return next(handleError(400,"please login"))
        }
        res.status(200).json(req.user)
    } catch (error) {
        return next(handleError(500,`get current user error ${error}`))
    }
}

export const generatedemo=async(req,res,next)=>{
    try {
        const result = await generateResponse("there is a check message that how you respond")
        const data = await extractJson(result)
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        return next(handleError(500,error))
    }
}
