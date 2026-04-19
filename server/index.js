import express, { application } from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import authRouter from "./routes/auth.route.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./routes/user.route.js"
import websiteRouter from "./routes/website.route.js"
import billingRouter from "./routes/billing.route.js"
import { stripeWebhook } from "./controller/stripeWebhook.controller.js"

dotenv.config()
const PORT = process.env.PORT

const app = express()
app.use(cookieParser())
app.use(express.json())
app.post('/api/stripe/webhook',express.raw({type:'application/json'}),stripeWebhook)
app.use(cors({
    origin: "http://localhost:5173",
    credentials:true
}))

//route setup
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/website",websiteRouter)
app.use("/api/billing",billingRouter)

//connect database
connectDB()

//error middleware
app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500
    const message = err.message || "internal server error."
    res.status(statusCode).json({
        success:false,
        statusCode,
        message
    })
})

app.listen(PORT,()=>{
    console.log("server running at PORT 3000"); 
})