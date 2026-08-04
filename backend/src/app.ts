import express from "express";
import cors from "cors";
import authRouter from "./routes/authRoutes";
import router from "./routes/expenseRoutes";


const app = express();


app.use(cors());
app.use(express.json());

app.use("/api/expenses", router);
app.use("/api/auth", authRouter);



export default app;