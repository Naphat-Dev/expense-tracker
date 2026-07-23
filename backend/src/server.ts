import app from "./app";
import { connectDB } from "./config/database";
import dotenv from 'dotenv'

dotenv.config();

connectDB();


app.listen(process.env.PORT ,()=>{
    console.log(`Server running on port ${process.env.PORT}`);
});