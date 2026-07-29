import express from "express";
import cors from "cors";
import router from "./routes/expenseRoutes";


const app = express();


app.use(cors());
app.use(express.json());

app.use("/api/expenses", router);


export default app;