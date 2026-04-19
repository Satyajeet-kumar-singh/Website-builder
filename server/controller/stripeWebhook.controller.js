import { handleError } from "../helper/handleError.js"
import User from "../model/user.model.js"

export const stripeWebhook=async(req,res,next)=>{
    const sig = req.headers.get('stripe-signature')
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body,sig,process.env.STRIPE_WEBHOOK-SECRET)
    } catch (error) {
        console.log(error)
        return next(handleError(500,`webhook error`))
    }

    if(event.type == 'checkout.session.completed'){
        const session = event.data.object
        const userId = session.metadata.userId
        const credits = Number(session.metadata.credits)
        const plan = session.metadata.plan

        await User.findByIdAndUpdate(userId,{
            $inc:{credits},
            plan
        })
    }
    return res.status(200).json({recieved:true})
}