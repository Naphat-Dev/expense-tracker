import express from "express";
import router from "./routes/expenseRountes";


const app = express();


app.use(express.json());

app.use("/api/expenses", router);


export default app;