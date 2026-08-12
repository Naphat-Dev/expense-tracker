import express from "express";
import cors from "cors";
import authRouter from "./routes/authRoutes";
import router from "./routes/expenseRoutes";
import profileRouter from "./routes/profileRoutes";


const app = express();


app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Expense Tracker API is running");
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

app.use("/api/expenses", router);
app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);




export default app;