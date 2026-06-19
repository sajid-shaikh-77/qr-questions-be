import app from "../src/app.js"
import dotenv from 'dotenv'
import app  from './app.js'
import connectDB from "../src/db/index.js"
dotenv.config({
    path: './env'
})

connectDB()
    .then(() => {
        // app.listen(process.env.PORT || 8000, () => {
        //     console.log("🚀 ~ process.env.PORT:", process.env.PORT)
        // })
    })
    .catch((error) => {
        console.error("🚀 ~ MongoDB Connection Error:", error)
    })
export default app;