import express from "express";
import cors from "cors"
import "dotenv/config"
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoutes.js";

import path from 'path'
import { fileURLToPath } from "url";
import resumeRoutes from './routes/resumeRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

const app=express();
const PORT=4000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, // if you're using cookies/auth headers
}));
app.use(express.json())

//connect db
connectDB();
//middleware



app.use("/api/auth",userRouter)
app.use('/api/resume',resumeRoutes);

app.use('/uploads',express.static(path.join(__dirname,'uploads')
))



//routes

app.get('/',(req,res)=>{
    res.send("API working")
})

app.listen(PORT,()=>{
    console.log(`server started on http://localhost:${PORT}`)
})