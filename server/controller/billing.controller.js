import { PLANS } from "../config/plan.js"
import stripe from "../config/stripe.js"
import { handleError } from "../helper/handleError.js"

export const billing=async(req,res,next)=>{
    try {
        const {planType} = req.body
        const userId = req.user._id
        const plan = PLANS[planType]
        if(!plan || plan.price == 0){
            return next(handleError(400,"invalid paid plan"))
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types:['card'],
            mode:'payment',
            line_items:[
                {
                    price_data:{
                        currency:'inr',
                        product_data:{
                            name:`Genweb.ai ${planType.toUpperCase()} plan`
                        },
                        unit_amount: plan.price * 100
                    },
                    quantity:1
                }
            ],
            metadata:{
                userId:userId.toString(),
                credits:plan.credits,
                plan:plan.plan
            },
            success_url:`${process.env.FRONTEND_URL}`,
            cancel_url:`${process.env.FRONTEND_URL}/pricing`
        })

        return res.status(200).json({sessionUrl:session.url})
    } catch (error) {
        return next(handleError(500,`billing error ${error}`))
    }
}
