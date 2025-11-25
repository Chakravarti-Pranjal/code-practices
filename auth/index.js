import express from "express";
import { config } from "dotenv";
import connectDB from "./src/config/connectDB.js";
import mainRouter from "./src/router/MainRoutes.js";
import cors from "cors";
config();

const app = express();
const PORT = 4040;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/v1", mainRouter);

app.use((err, req, res, next) => {
  console.log("Error : ", err);
  next();
});

app.listen(PORT, async () => {
  await connectDB();
  console.log(`server is running on port : ${PORT}`);
});
