import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors"
const app = express()
// app.use(cors())

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "16Kb" })) // * setting limit
app.use(express.urlencoded({ extended: true, limit: "16Kb" })) // * extended use to send nested data in URL 
app.use(express.static("public")) // * save file images
app.use(cookieParser()) // * set | access cookies 



// * routes declaration
// app.use("/api/v1/users",userRouter)  
export { app }