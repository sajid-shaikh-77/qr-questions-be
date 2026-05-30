// require('dotenv').config({path:'./env'})
import dotenv from 'dotenv'
import connectDB from './db/index.js'
import { app } from './app.js'
dotenv.config({
    path: './env'
})

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log("🚀 ~ process.env.PORT:", process.env.PORT)
        })
    })
    .catch((error) => {
        console.error("🚀 ~ MongoDB Connection Error:", error)
    })