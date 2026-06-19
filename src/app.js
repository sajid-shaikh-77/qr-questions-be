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

// Root route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Backend is running"
    });
});


import adminRouter from './routes/admin.routes.js'
// * routes declaration
app.use("/api/v1/admin",adminRouter)

export default app;